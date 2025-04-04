import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import Layout from "src/components/Layout";
import Button from "src/components/ui/Button";
import {CircularProgress, List, ListItem, ListItemText, Paper, TextField} from "@mui/material";
import {getSensors, Sensor} from "src/services/mainService";
import {useNavigate} from "react-router-dom";

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
    return (
        <Layout>
                <div className={'page-header'}>
                    <h1>Датчики</h1>
                </div>
                <div className={'page-toolbar'}>
                    <Button>Создать</Button>
                </div>
                <div className={'page-content'}>
                    <Paper elevation={3}
                           sx={{
                               backgroundColor: 'var(--card-background)', // Используем CSS-переменную
                               border: '1px solid var(--border-color)',
                               padding: '16px',
                           }}>
                        {/* Поле поиска */}
                        <TextField
                            label="Поиск"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            style={{ marginBottom: '16px' }}
                            className={'textfield'}
                        />

                        {/* Список элементов */}
                        <List>
                            <>
                                {isLoading && <CircularProgress color="secondary" size={50} thickness={5} />}
                                {filteredItems.map((item, index) => (
                                    <ListItem 
                                        key={index} 
                                        className={'list-item'}
                                        onClick={() => navigate(`/sensors/${item.id}`)}
                                    >
                                        <ListItemText primary={item.ticketTitle} />
                                    </ListItem>
                                ))}
                            </>
                        </List>
                    </Paper>
                </div>
            </Layout>
    );
};
export default SensorsPage;
