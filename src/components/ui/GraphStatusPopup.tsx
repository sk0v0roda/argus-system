import React, {useCallback, useEffect, useState} from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    BackgroundVariant,
    addEdge,
    type Connection, Edge, Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {Popover} from "@mui/material";
import {getStatusGraphs, StatusGraph} from "src/services/mainService";

interface GraphStatusPopupProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

const GraphStatusPopup: React.FC<GraphStatusPopupProps> = ({open, anchorEl, onClose}) => {
    const [graphs, setGraphs] = useState<StatusGraph[]>([]);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
        getStatusGraphs()
            .then((data) => {
                setGraphs(data);
                console.log(data)
                if (data.length > 0) {
                    setNodes(data[0].nodes);
                    setEdges(data[0].edges);
                }
            })
            .catch((error) => {
                console.error('Error fetching graphs:', error);
            });
    }, []);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <Popover
            open={open}  // Используем переданное состояние
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            transformOrigin={{vertical: 'top', horizontal: 'left'}}
            sx={{
                '& .MuiPopover-paper': {
                    width: '600px',
                    height: '400px',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                },
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <defs>
                    <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
                    </marker>
                </defs>
                <Controls/>
                <MiniMap/>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
            </ReactFlow>
        </Popover>
    );
};

export default GraphStatusPopup;