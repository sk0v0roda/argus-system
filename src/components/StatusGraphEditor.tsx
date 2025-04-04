import React, { useState, useCallback } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button as MuiButton } from '@mui/material';
import { StatusGraph } from '../services/mainService';
import Button from './ui/Button';

interface StatusGraphEditorProps {
    graph: StatusGraph;
    onSave: (graph: StatusGraph) => void;
}

const StatusGraphEditor: React.FC<StatusGraphEditorProps> = ({ graph, onSave }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges);
    const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false);
    const [newNodeLabel, setNewNodeLabel] = useState('');

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleSave = () => {
        onSave({
            ...graph,
            nodes,
            edges,
        });
    };

    const handleAddNode = () => {
        if (newNodeLabel.trim()) {
            const newNode: Node = {
                id: `node-${nodes.length + 1}`,
                data: { label: newNodeLabel },
                position: { x: 100, y: 100 }, // Начальная позиция нового узла
                type: 'default'
            };
            setNodes((nds) => [...nds, newNode]);
            setNewNodeLabel('');
            setIsAddNodeDialogOpen(false);
        }
    };

    return (
        <>
            <Box sx={{ height: '600px', width: '100%', border: '1px solid #eee' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    defaultEdgeOptions={{ 
                        animated: true,
                        style: { stroke: '#666', strokeWidth: 2 }
                    }}
                    nodesDraggable={true}
                    nodesConnectable={true}
                    elementsSelectable={true}
                    minZoom={0.1}
                    maxZoom={4}
                    attributionPosition="bottom-right"
                >
                    <Background />
                    <Controls />
                    <Panel position="top-right" style={{ display: 'flex', gap: '8px' }}>
                        <Button onClick={() => { console.log("Opening dialog"); setIsAddNodeDialogOpen(true); }}>
                            Добавить узел
                        </Button>
                        <Button onClick={() => { console.log("Saving changes"); handleSave(); }}>
                            Сохранить изменения
                        </Button>
                    </Panel>
                </ReactFlow>
            </Box>

            <Dialog open={isAddNodeDialogOpen} onClose={() => setIsAddNodeDialogOpen(false)}>
                <DialogTitle>Добавить новый узел</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название узла"
                        fullWidth
                        variant="outlined"
                        value={newNodeLabel}
                        onChange={(e) => setNewNodeLabel(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setIsAddNodeDialogOpen(false)}>Отмена</MuiButton>
                    <MuiButton onClick={handleAddNode} variant="contained">Добавить</MuiButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StatusGraphEditor; 