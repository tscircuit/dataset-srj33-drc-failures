"""Independent SRJ33 evidence verification with Shapely 2.1.2.

This does not call the autorouter converter or its DRC checker. It reconstructs
nets from declared identities, and copper from original SRJ pads and raw routed
segments. Wire widths use the smaller endpoint width. Legacy multi-layer
rectangles without provenance use their inscribed disk, avoiding reliance on
possibly artificial bounding-box corners. Every witness needs a shared layer,
known net identities, and a measured violation with a 1e-7 mm margin.

Ambiguous identities, missing terminals, and non-reproducible geometry are not
accepted as evidence. Same-net via spacing is the only accepted same-net rule.
"""
import json
import gzip
import pathlib
import math
import collections
import argparse
from shapely.geometry import Point, LineString, box
from shapely.affinity import rotate, scale, translate

class DSU:

    def __init__(self):
        self.p = {}

    def get(self, x):
        if x not in self.p:
            self.p[x] = x
        if self.p[x] != x:
            self.p[x] = self.get(self.p[x])
        return self.p[x]

    def add(self, ids):
        ids = [x for x in ids if x]
        for x in ids[1:]:
            self.p[self.get(x)] = self.get(ids[0])

def shape(o):
    w, h = (o['width'], o['height'])
    x, y = (o['center']['x'], o['center']['y'])
    g = box(-w / 2, -h / 2, w / 2, h / 2) if o['type'] == 'rect' else scale(Point(0, 0).buffer(1, quad_segs=256), w / 2, h / 2)
    return translate(rotate(g, o.get('ccwRotationDegrees', 0)), x, y)

def segments(t):
    for i, (a, b) in enumerate(zip(t['route'], t['route'][1:])):
        if a['route_type'] == 'wire' and b['route_type'] == 'wire' and (a['layer'] == b['layer']):
            yield (i, a['layer'], LineString([(a['x'], a['y']), (b['x'], b['y'])]), min(a['width'], b['width']) / 2)
        elif a['route_type'] == 'wire' and b['route_type'] == 'via':
            yield (i, a['layer'], LineString([(a['x'], a['y']), (b['x'], b['y'])]), a['width'] / 2)
        elif a['route_type'] == 'via' and b['route_type'] == 'wire':
            yield (i, b['layer'], LineString([(a['x'], a['y']), (b['x'], b['y'])]), b['width'] / 2)

def audit_geometry(archive):
    allrows = []
    for case in archive['samples']:
        s = case['source']
        sid = s['id']
        inp = case['inputSrj']
        res = case['result']
        ev = res
        ds = DSU()
        if res.get('status') in ['routing-failed', 'error', 'timeout', 'worker-error']:
            allrows.append({'id': sid, 'counts': {}, 'errors': [], 'routingStatus': res['status']})
            continue
        for c in inp['connections'] + ev['pointPairSrj']['connections']:
            ds.add([c['name'], c.get('__netConnectionName'), c.get('source_trace_id'), *c.get('__rootConnectionNames', []), *[v for p in c['pointsToConnect'] for v in [p.get('pcb_port_id'), p.get('pointId')]]])
        for o in inp['obstacles']:
            ds.add(o['connectedTo'] + [v for k, v in o.get('circuitJsonMetadata', {}).items() if k in ['pcb_smtpad_id', 'pcb_plated_hole_id', 'pcb_port_id', 'pcb_via_id']])
        replaced = {t.get('__replaces_pcb_trace_id') for t in ev['routedTraces']}
        ts = [t for t in inp.get('traces', []) if t['pcb_trace_id'] not in replaced] + ev['routedTraces']
        tr = {t['pcb_trace_id']: t for t in ts}
        for t in ts:
            ds.add([t['pcb_trace_id'], t['connection_name'], *t.get('connectsTo', [])])
        objs = {}
        for t in ts:
            objs[t['pcb_trace_id']] = {'net': ds.get(t['pcb_trace_id']), 'geometry': list(segments(t)), 'kind': 'trace'}
        for el in res['circuitJson']:
            if el['type'] in ['pcb_smtpad', 'pcb_plated_hole']:
                eid = el.get('pcb_smtpad_id', el.get('pcb_plated_hole_id'))
                base = eid.split('__fragment_')[0]
                matches = [o for o in inp['obstacles'] if base in [o.get('circuitJsonMetadata', {}).get('pcb_smtpad_id'), o.get('circuitJsonMetadata', {}).get('pcb_plated_hole_id'), o['connectedTo'][0] if o['connectedTo'] else None] and abs(o['center']['x'] - el['x']) < 1e-08 and (abs(o['center']['y'] - el['y']) < 1e-08)]
                if len(matches) == 1:
                    o = matches[0]
                    objs[eid] = {'net': ds.get(o['connectedTo'][0]) if o['connectedTo'] else None, 'geometry': [(0, l, Point(o['center']['x'], o['center']['y']).buffer(min(o['width'], o['height']) / 2, quad_segs=256) if o['type'] == 'rect' and len(o['layers']) > 1 and (not o.get('circuitJsonMetadata')) else shape(o), 0) for l in o['layers']], 'kind': 'pad', 'source': o}
            if el['type'] == 'pcb_via':
                owner = el.get('pcb_trace_id')
                layers = ['top'] + [f'inner{i}' for i in range(1, inp['layerCount'] - 1)] + ['bottom']
                found = []
                for t in ts:
                    for p in t['route']:
                        if p['route_type'] == 'via' and p['x'] == el['x'] and (p['y'] == el['y']) and (t['pcb_trace_id'] == owner):
                            a, b = (layers.index(p['from_layer']), layers.index(p['to_layer']))
                            ls = layers[min(a, b):max(a, b) + 1]
                            radius = p.get('via_diameter', inp.get('minViaDiameter', inp.get('min_via_pad_diameter', inp.get('minViaPadDiameter', 0.3)))) / 2
                            found.append((ls, radius))
                if found:
                    ls, radius = found[0]
                    objs[el['pcb_via_id']] = {'net': ds.get(owner), 'geometry': [(0, l, Point(el['x'], el['y']), radius) for l in ls], 'kind': 'via'}
        declaredNets = {ds.get(v) for c in inp['connections'] for v in [c['name']]} | {ds.get(v) for o in inp['obstacles'] for v in o['connectedTo']} | {ds.get(t['pcb_trace_id']) for t in inp.get('traces', [])}
        rows = []
        for e in res['errors']:
            a = e.get('pcb_trace_id')
            b = e.get('pcb_pad_id', e.get('pcb_via_id'))
            a, b = e['pcb_via_ids'] if e.get('pcb_via_ids') and len(e['pcb_via_ids']) == 2 else (a, b)
            eid = e.get('pcb_trace_error_id', '')
            if eid.startswith('overlap_' + str(a) + '_'):
                b = eid[len('overlap_' + a + '_'):]
            row = {'error': e, 'status': 'unresolved'}
            if a in objs and b in objs:
                aa, bb = (objs[a], objs[b])
                pairs = [(g.distance(h) - r - q, l, i, j) for i, l, g, r in aa['geometry'] for j, k, h, q in bb['geometry'] if l == k]
                same = aa['net'] == bb['net']
                minimum = min(pairs) if pairs else None
                row.update(pair=[a, b], sameNet=same, independentClearance=minimum[0] if minimum else None, layer=minimum[1] if minimum else None, segmentIndices=list(minimum[2:]) if minimum else None)
                row['status'] = 'unresolved-net' if aa['net'] not in declaredNets or bb['net'] not in declaredNets else 'confirmed' if minimum and minimum[0] < e.get('minimum_clearance', 0.1) - 1e-07 and (not same or e['type'] == 'pcb_via_clearance_error') else 'same-net' if same else 'geometry-mismatch'
            elif eid.startswith('disconnected_endpoint_') and a in tr:
                p = tr[a]['route'][0 if eid.endswith('_start') else -1]
                pt = Point(p['x'], p['y'])
                near = []
                for o in inp['obstacles']:
                    if p.get('layer') in o['layers'] and o['connectedTo'] and (ds.get(o['connectedTo'][0]) == ds.get(a)) and (shape(o).distance(pt) < 1e-08):
                        near.append(o['connectedTo'][0])
                contacts = []
                for tid, obj in objs.items():
                    if tid == a:
                        continue
                    if obj['net'] == ds.get(a):
                        for i, l, g, r in obj['geometry']:
                            if l == p.get('layer') and g.distance(pt) <= r + p.get('width', 0) / 2 + 1e-06:
                                contacts.append(tid)
                                break
                row.update(containingSameNetPads=near, touchingSameNetCopper=contacts)
                row['status'] = 'endpoint-on-copper' if near or contacts else 'unresolved-endpoint'
            if len(tr) != len(ts):
                row['status'] = 'unresolved-duplicate-trace-id'
            rows.append(row)
        allrows.append({'id': sid, 'counts': dict(collections.Counter((x['status'] for x in rows))), 'errors': rows})
    return allrows

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=pathlib.Path)
    args = parser.parse_args()
    root = pathlib.Path(__file__).resolve().parents[1]
    manifest = json.loads((root / 'manifest.json').read_text())
    archive = json.loads(gzip.decompress((root / manifest['authenticityAudit']['resultArchive']).read_bytes()))
    actual = audit_geometry(archive)
    if args.output:
        args.output.write_text(json.dumps(actual, indent=2) + '\n')
        return
    expected = json.loads((root / manifest['authenticityAudit']['geometryFile']).read_text())
    assert [(r['id'], [e['status'] for e in r['errors']]) for r in actual] == [(r['id'], [e['status'] for e in r['errors']]) for r in expected]
    retained = [r['id'] for r in actual if r['errors'] and all((e['status'] == 'confirmed' for e in r['errors']))]
    assert retained == [s['id'] for s in manifest['samples']]
    for row in actual:
        if row['id'] in retained:
            for e in row['errors']:
                assert e['independentClearance'] < e['error'].get('minimum_clearance', 0.1) - 1e-07
    print('Independently verified', len(retained), 'samples and', sum((len(r['errors']) for r in actual if r['id'] in retained)), 'clearance witnesses.')
if __name__ == '__main__':
    main()
