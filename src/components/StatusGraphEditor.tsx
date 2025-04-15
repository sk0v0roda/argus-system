import React, { useState, useCallback, useEffect } from 'react';
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
import { Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button as MuiButton, Autocomplete } from '@mui/material';
import { StatusGraph, Status, getStatuses } from '../services/statusService';
import Button from './ui/Button';

interface StatusGraphEditorProps {
    graph: StatusGraph;
    onSave: (graph: StatusGraph) => void;
    isEditing?: boolean;
}

const StatusGraphEditor: React.FC<StatusGraphEditorProps> = ({ graph, onSave, isEditing = true }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(graph.edges);
    const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [isStatusesLoading, setIsStatusesLoading] = useState(true);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const data = await getStatuses();
                setStatuses(data);
            } catch (error) {
                console.error('Ошибка загрузки статусов:', error);
            } finally {
                setIsStatusesLoading(false);
            }
        };

        fetchStatuses();
    }, []);

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
        if (selectedStatus) {
            // Проверяем, существует ли уже узел с таким ID
            const existingNode = nodes.find(node => node.id === selectedStatus.id);
            if (existingNode) {
                console.log('Узел с таким статусом уже существует');
                return;
            }

            const newNode: Node = {
                id: selectedStatus.id || `node-${nodes.length + 1}`,
                data: { label: selectedStatus.name },
                position: { x: 100, y: 100 },
                type: 'default'
            };
            setNodes((nds) => [...nds, newNode]);
            setSelectedStatus(null);
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
                    nodesDraggable={isEditing}
                    nodesConnectable={isEditing}
                    elementsSelectable={isEditing}
                    minZoom={0.1}
                    maxZoom={4}
                    attributionPosition="bottom-right"
                >
                    <Background />
                    <Controls />
                    {isEditing && (
                        <Panel position="top-right" style={{ display: 'flex', gap: '8px' }}>
                            <Button onClick={() => setIsAddNodeDialogOpen(true)}>
                                Добавить узел
                            </Button>
                            <Button onClick={handleSave}>
                                Сохранить изменения
                            </Button>
                        </Panel>
                    )}
                </ReactFlow>
            </Box>

            <Dialog 
                open={isAddNodeDialogOpen} 
                onClose={() => setIsAddNodeDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        minHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <DialogTitle>Добавить новый узел</DialogTitle>
                <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Autocomplete
                        value={selectedStatus}
                        onChange={(event, newValue) => setSelectedStatus(newValue)}
                        options={statuses}
                        getOptionLabel={(option) => option.name}
                        loading={isStatusesLoading}
                        loadingText="Загрузка статусов..."
                        noOptionsText="Статусы не найдены"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Выберите статус"
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <MuiButton onClick={() => setIsAddNodeDialogOpen(false)}>Отмена</MuiButton>
                    <MuiButton onClick={handleAddNode} variant="contained" disabled={!selectedStatus}>
                        Добавить
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StatusGraphEditor; 