import React, { useEffect, useState } from 'react';
import { Duty, getDuties } from '../services/dutyService';
import { useNavigate } from 'react-router-dom';
import Layout from "src/components/Layout";
import Button from "src/components/ui/Button";
import { CircularProgress, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import { formPaperStyles, formTextFieldStyles, listItemStyles } from "src/styles/formStyles";

const DutyPage: React.FC = () => {
    const [duties, setDuties] = useState<Duty[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setIsLoading(true);
        getDuties().then((data) => {
            setIsLoading(false);
            setDuties(data);
        });
    }, []);

    const formatDutyInfo = (duty: Duty) => {
        const date = new Date(duty.start_time).toLocaleString();
        const hours = duty.interval.seconds / 3600;
        const employees = duty.ids.length;
        return `Начало: ${date} | Длительность: ${hours}ч | Сотрудников: ${employees}`;
    };

    const filteredDuties = duties.filter((duty) =>
        (duty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatDutyInfo(duty).toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Дежурства</h1>
            </div>
            <div className={'page-toolbar'}>
                <Button onClick={() => navigate('/duties/new')}>Создать</Button>
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
                        {filteredDuties.map((duty) => (
                            <ListItem
                                key={duty.id}
                                className={'list-item'}
                                onClick={() => navigate(`/duties/${duty.id}`)}
                                sx={listItemStyles}
                            >
                                <ListItemText
                                    primary={duty.name}
                                    secondary={formatDutyInfo(duty)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        </Layout>
    );
};

export default DutyPage;
