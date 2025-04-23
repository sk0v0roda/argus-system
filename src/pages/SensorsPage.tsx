import {useLocation} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import Layout from "src/components/Layout";
import Button from "src/components/ui/Button";
import {CircularProgress, List, ListItem, ListItemText, Paper, TextField} from "@mui/material";
import {getSensors, Sensor} from "src/services/sensorService";
import {useNavigate} from "react-router-dom";
import { formPaperStyles, formTextFieldStyles, listItemStyles } from "src/styles/formStyles";

const SensorsPage = () => {
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        getSensors().then((data) => {
            setIsLoading(false);
            return setSensors(data)
        });
    }, []);

// Состояние для хранения поискового запроса
    const [searchQuery, setSearchQuery] = useState('');

// Фильтрация элементов по поисковому запросу
    const filteredItems = sensors.filter((item) =>
        item.ticketTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPriorityLabel = (priority: number) => {
        switch (priority) {
            case 0:
                return 'Низкий';
            case 1:
                return 'Средний';
            case 2:
                return 'Высокий';
            default:
                return 'Неизвестно';
        }
    };

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Датчики</h1>
            </div>
            <div className={'page-toolbar'}>
                <Button onClick={() => navigate('/sensors/new')}>Создать</Button>
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
                        {filteredItems.map((item) => (
                            <ListItem
                                key={item.id}
                                className={'list-item'}
                                onClick={() => navigate(`/sensors/${item.id}`)}
                                sx={listItemStyles}
                            >
                                <ListItemText 
                                    primary={item.ticketTitle}
                                    secondary={`Приоритет: ${getPriorityLabel(item.priority)} | Срок решения: ${item.resolveDaysCount} дней`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </div>
        </Layout>
    );
};

export default SensorsPage;
