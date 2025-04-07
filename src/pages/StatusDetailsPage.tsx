import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Status, getStatusById, updateStatus, createStatus } from '../services/statusService';
import Layout from "src/components/Layout";
import { CircularProgress, Paper, TextField, Button, Box } from "@mui/material";
import { formTextFieldStyles, formPaperStyles, formButtonStyles } from "src/styles/formStyles";

const StatusDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [statusData, setStatusData] = useState<Status | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const isCreating = !id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    // Создание нового статуса
                    setStatusData({
                        id: undefined,
                        name: '',
                        description: '',
                        escalationSLA: 60,
                        notification: {
                            deliveryType: 'Email',
                            pingInterval: 15
                        },
                        comment: {
                            text: '',
                            userIds: []
                        },
                        dutyId: 1
                    });
                    setIsEditing(true);
                    setIsLoading(false);
                    return;
                }

                const data = await getStatusById(id);
                setStatusData(data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSave = async () => {
        if (statusData) {
            try {
                let savedStatus;
                if (isCreating) {
                    savedStatus = await createStatus(statusData);
                    navigate('/statuses');
                } else {
                    savedStatus = await updateStatus(statusData);
                }
                setIsEditing(false);
            } catch (error) {
                console.error('Ошибка сохранения данных:', error);
            }
        }
    };

    const handleChange = (field: keyof Status | 'deliveryType' | 'pingInterval' | 'commentText' | 'userIds') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!statusData) return;

        const value = event.target.value;
        let updatedData: Status = { ...statusData };

        switch (field) {
            case 'name':
            case 'description':
                updatedData[field] = value;
                break;
            case 'escalationSLA':
                updatedData.escalationSLA = parseInt(value) || 0;
                break;
            case 'deliveryType':
                updatedData.notification = {
                    ...updatedData.notification,
                    deliveryType: value
                };
                break;
            case 'pingInterval':
                updatedData.notification = {
                    ...updatedData.notification,
                    pingInterval: parseInt(value) || 0
                };
                break;
            case 'commentText':
                updatedData.comment = {
                    ...updatedData.comment,
                    text: value
                };
                break;
            case 'userIds':
                updatedData.comment = {
                    ...updatedData.comment,
                    userIds: value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
                };
                break;
            case 'dutyId':
                updatedData.dutyId = parseInt(value) || 1;
                break;
        }

        setStatusData(updatedData);
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>{isCreating ? 'Создание статуса' : 'Детали статуса'}</h1>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50} thickness={5}/>
                    ) : statusData ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Название"
                                value={statusData.name}
                                onChange={handleChange('name')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Описание"
                                value={statusData.description}
                                onChange={handleChange('description')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={4}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="SLA эскалации (минуты)"
                                type="number"
                                value={statusData.escalationSLA}
                                onChange={handleChange('escalationSLA')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Тип уведомления"
                                value={statusData.notification.deliveryType}
                                onChange={handleChange('deliveryType')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Интервал уведомлений (минуты)"
                                type="number"
                                value={statusData.notification.pingInterval}
                                onChange={handleChange('pingInterval')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="Комментарий"
                                value={statusData.comment.text}
                                onChange={handleChange('commentText')}
                                disabled={!isEditing}
                                fullWidth
                                multiline
                                rows={2}
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="ID пользователей (через запятую)"
                                value={statusData.comment.userIds.join(', ')}
                                onChange={handleChange('userIds')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <TextField
                                label="ID дежурства"
                                type="number"
                                value={statusData.dutyId}
                                onChange={handleChange('dutyId')}
                                disabled={!isEditing}
                                fullWidth
                                sx={formTextFieldStyles}
                            />
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                {!isEditing && !isCreating ? (
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => setIsEditing(true)}
                                        sx={formButtonStyles}
                                    >
                                        Редактировать
                                    </Button>
                                ) : (
                                    <>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => {
                                                if (isCreating) {
                                                    navigate('/statuses');
                                                } else {
                                                    setIsEditing(false);
                                                }
                                            }}
                                            sx={formButtonStyles}
                                        >
                                            Отмена
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={handleSave}
                                            sx={formButtonStyles}
                                        >
                                            {isCreating ? 'Создать' : 'Сохранить'}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    ) : !isCreating && (
                        <div>Статус не найден</div>
                    )}
                </Paper>
            </div>
        </Layout>
    );
};

export default StatusDetailsPage; 