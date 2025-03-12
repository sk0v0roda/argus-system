import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Layout from "src/components/Layout";
import {CircularProgress, Paper, Typography} from "@mui/material";
import {getStatusGraphById, StatusGraph} from "src/services/mainService";
import {Background, BackgroundVariant, Controls, MiniMap, ReactFlow} from "@xyflow/react";


const GraphDetailsPage = () => {
    const {id} = useParams<{ id: string }>();
    const [graphData, setGraphData] = useState<StatusGraph | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Добавляем проверку на существование id
                if (!id) {
                    throw new Error('ID графа не указан');
                }


                const data = await getStatusGraphById(id);
                setGraphData(data);
                console.log(data.edges)
                console.log(data.nodes)

            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Детали графа</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={{padding: '16px'}}>
                    <>
                        {isLoading ? (
                            <CircularProgress color="secondary" size={50} thickness={5}/>
                        ) : graphData ? (
                            <>
                                <div>
                                    {graphData.name}
                                    {/* Дополнительная информация о графе */}
                                </div>
                                <div style={{ height: '600px', width: '100%' }}>
                                    <ReactFlow
                                        nodes={graphData.nodes}
                                        edges={graphData.edges}
                                        fitView
                                        attributionPosition="top-right"
                                    >
                                        <Background
                                            gap={16}
                                            color="var(--border-color)"
                                            variant={BackgroundVariant.Dots}
                                        />
                                        <Controls />
                                        <MiniMap
                                        />
                                    </ReactFlow>
                                </div>
                            </>
                        ) : (
                            <Typography variant="h6">Граф не найден</Typography>
                        )}
                    </>
                </Paper>
            </div>
        </Layout>
    );
};

export default GraphDetailsPage;