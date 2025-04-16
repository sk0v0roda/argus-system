import React, { useEffect, useState } from 'react';
import { Status, getStatuses } from '../services/statusService';
import { useNavigate } from 'react-router-dom';
import Layout from "src/components/Layout";
import Button from "src/components/ui/Button";
import { CircularProgress, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import { formPaperStyles, formTextFieldStyles, listItemStyles } from "src/styles/formStyles";

const StatusPage: React.FC = () => {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStatuses = async () => {
            setIsLoading(true);
            try {
                const data = await getStatuses();
                if (Array.isArray(data)) {
                    setStatuses(data);
                } else {
                    console.error('Полученные данные не являются массивом:', data);
                    setStatuses([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке статусов:', error);
                setStatuses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatuses();
    }, []);

    const formatStatusInfo = (status: Status) => {
        return `SLA: ${status.escalationSLA} мин. | Тип уведомления: ${status.notification.deliveryType} | Интервал: ${status.notification.pingInterval} мин.`;
    };

    const filteredStatuses = statuses.filter((status) =>
        status.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Статусы</h1>
            </div>
            <div className={'page-toolbar'}>
                <Button onClick={() => navigate('/statuses/new')}>Создать</Button>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3} sx={formPaperStyles}>
                    <TextField
                        label="Поиск"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        style={{ marginBottom: '16px' }}
                        className={'textfield'}
                        sx={formTextFieldStyles}
                    />

                    <List>
                        {isLoading && <CircularProgress color="secondary" size={50} thickness={5} />}
                        {filteredStatuses.map((status) => (
                            <ListItem
                                key={status.id}
                                className={'list-item'}
                                onClick={() => navigate(`/statuses/${status.id}`)}
                                sx={listItemStyles}
                            >
                                <ListItemText
                                    primary={status.name}
                                    secondary={formatStatusInfo(status)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        </Layout>
    );
};

export default StatusPage; 