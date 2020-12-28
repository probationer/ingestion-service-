import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const columns = [
    { id: 'serial', label: 'Serial', minWidth: 50 },
    { id: 'code', label: 'Ingestion Job Id', minWidth: 200 },
    {
        id: 's3Key',
        label: 'File Name',
        minWidth: 200,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'date',
        label: 'Date',
        minWidth: 150,
        align: 'left',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'button',
        label: ' ',
        minWidth: 100,
        align: 'center',
        format: (value) => value.toFixed(2),
    },
];

export default function JobTable (props){

        const { rows } = props;
        return (
            <Paper style={{ marginLeft: '10%', width: '80%' }}>
                <TableContainer style={{ maxHeight: 500 }} >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => {
                                return (
                                    <TableRow hover tabIndex={-1} key={row.code}>
                                        {columns.map((column, index) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={index} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        );
}