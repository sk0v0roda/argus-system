import {useCallback, useEffect, useState} from "react";
import Layout from "src/components/Layout";
import Button from "src/components/ui/Button";
import {List, Paper, TextField, ListItem, ListItemText, CircularProgress} from "@mui/material";
import {getProcesses, Process} from "src/services/processService";
import {useNavigate} from "react-router-dom";
import {formTextFieldStyles} from "src/styles/formStyles";

const ProcessPage = () => {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        getProcesses().then((data) => {
            setIsLoading(false);
            return setProcesses(data)
        });
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const filteredItems = processes.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Процессы</h1>
            </div>
            <div className={'page-toolbar'}>
                <Button onClick={() => navigate('/processes/new')}>Создать</Button>
            </div>
            <div className={'page-content'}>
                <Paper elevation={3}
                       sx={{
                           backgroundColor: 'var(--card-background)',
                           border: '1px solid var(--border-color)',
                           padding: '16px',
                       }}>
                    <TextField
                        label="Поиск"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        style={{marginBottom: '16px'}}
                        className={'textfield'}
                        sx={formTextFieldStyles}
                    />

                    <List>
                        <>
                            {isLoading && <CircularProgress color="secondary" size={50} thickness={5}/>}
                            {filteredItems.map((item, index) => (
                                <ListItem
                                    key={index}
                                    className={'list-item'}
                                    onClick={() => navigate(`/processes/${item.id}`)}
                                >
                                    <ListItemText 
                                        primary={item.name}
                                        secondary={item.description}
                                    />
                                </ListItem>
                            ))}
                        </>
                    </List>
                </Paper>
            </div>
        </Layout>
    );
};

export default ProcessPage; 