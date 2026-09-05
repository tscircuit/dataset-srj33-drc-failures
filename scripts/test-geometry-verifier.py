"""Check that the independent verifier rejects invalid clearance witnesses."""
import copy
import importlib.util
import pathlib

path = pathlib.Path(__file__).with_name('verify-geometry.py')
spec = importlib.util.spec_from_file_location('geometry_verifier', path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

srj = {
    'layerCount': 2, 'minTraceWidth': 0.1, 'obstacles': [],
    'connections': [{'name': 'a', 'pointsToConnect': []}, {'name': 'b', 'pointsToConnect': []}],
}
traces = [
    {'pcb_trace_id': 'trace-a', 'connection_name': 'a', 'route': [
        {'route_type': 'wire', 'x': -1, 'y': 0, 'width': 0.1, 'layer': 'top'},
        {'route_type': 'wire', 'x': 1, 'y': 0, 'width': 0.1, 'layer': 'top'},
    ]},
    {'pcb_trace_id': 'trace-b', 'connection_name': 'b', 'route': [
        {'route_type': 'wire', 'x': 0, 'y': -1, 'width': 0.1, 'layer': 'top'},
        {'route_type': 'wire', 'x': 0, 'y': 1, 'width': 0.1, 'layer': 'top'},
    ]},
]
archive = {'samples': [{'source': {'id': 'control'}, 'inputSrj': srj, 'result': {
    'status': 'qualifies', 'pointPairSrj': copy.deepcopy(srj), 'routedTraces': traces,
    'circuitJson': [], 'errors': [{'type': 'pcb_trace_error', 'pcb_trace_id': 'trace-a',
                                  'pcb_trace_error_id': 'overlap_trace-a_trace-b'}],
}}]}

def status(data):
    return module.audit_geometry(data)[0]['errors'][0]['status']

assert status(archive) == 'confirmed'
separated = copy.deepcopy(archive)
for point in separated['samples'][0]['result']['routedTraces'][1]['route']:
    point['x'] += 10
assert status(separated) == 'geometry-mismatch'
same_net = copy.deepcopy(archive)
same_net['samples'][0]['inputSrj']['connections'][1]['__rootConnectionNames'] = ['a']
assert status(same_net) == 'same-net'
other_layer = copy.deepcopy(archive)
for point in other_layer['samples'][0]['result']['routedTraces'][1]['route']:
    point['layer'] = 'bottom'
assert status(other_layer) == 'geometry-mismatch'
print('Geometry controls passed: crossing, separation, net identity, and layer isolation.')
