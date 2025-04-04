import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Layout from "src/components/Layout";
import {CircularProgress, Paper} from "@mui/material";
import {getStatusGraphById, StatusGraph} from "src/services/mainService";
import StatusGraphEditor from "src/components/StatusGraphEditor";
import {formPaperStyles} from "src/styles/formStyles";

const GraphDetailsPage = () => {
    const {id} = useParams<{ id: string }>();
    const [graphData, setGraphData] = useState<StatusGraph | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    throw new Error('ID графа не указан');
                }

                const data = await getStatusGraphById(id);
                setGraphData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleGraphSave = (updatedGraph: StatusGraph) => {
        console.log('Сохранение графа:', updatedGraph);
        // Здесь будет логика сохранения графа
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>{graphData?.name || 'Граф статусов'}</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50} thickness={5}/>
                    ) : graphData ? (
                        <StatusGraphEditor 
                            graph={graphData}
                            onSave={handleGraphSave}
                        />
                    ) : (
                        <div>Граф не найден</div>
                    )}
                </Paper>
            </div>
        </Layout>
    );
};

export default GraphDetailsPage;