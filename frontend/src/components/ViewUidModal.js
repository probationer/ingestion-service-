import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const columns = [
    { id: "uid", align: 'left'},
    { id: "platform", align: 'left'}
]

function CreateUidTable(rows) {
    return (<TableContainer style={{ maxHeight: 500 }} >
        <Table >
            <TableBody>
                {rows.map((row, index) => {
                    return (
                        <TableRow hover tabIndex={-1} key={row.uid + index}>
                            {columns.map((column, index) => {
                                const value = row[column.id];
                                return (
                                    <TableCell key={index} align={column.align}>
                                        {value}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table >
    </TableContainer >);

}

function ViewUidModal({ body, open, handleClose, }) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <div style={modalStyle} className={classes.paper}>
                {CreateUidTable(body)}
            </div>
        </Modal>
    )
}

export default ViewUidModal;