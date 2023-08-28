import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Scrollbar from './Scrollbar';
import { useSelector } from 'react-redux';
import DescriptionIcon from '@mui/icons-material/Description';
import IconPdf from 'ui-component/custom-icon/IconPdf';
import IconXls from 'ui-component/custom-icon/IconXls';
import IconDocx from 'ui-component/custom-icon/IconDocx';
import IconPptx from 'ui-component/custom-icon/IconPptx';
import IconImg from 'ui-component/custom-icon/IconImg';
import IconGif from 'ui-component/custom-icon/IconGif';
import { Stack } from '@mui/material';
import { format } from 'date-fns';

function createData(name, createdBy, date) {
    return {
        name,
        createdBy,
        date
    };
}

const rows = [
    createData('Cupcake', 'YASUDA_FRIENDs', 3.7),
    createData('Donut', 'YASUDA_FRIENDs', 25.0),
    createData('Eclair', 'YASUDA_FRIENDs', 16.0),
    createData('Frozen yoghurt', 'YASUDA_FRIENDs', 6.0),
    createData('Gingerbread', 'YASUDA_FRIENDs', 16.0),
    createData('Honeycomb', 'YASUDA_FRIENDs', 3.2),
    createData('Ice cream sandwich', 'YASUDA_FRIENDs', 9.0),
    createData('Jelly Bean', 'YASUDA_FRIENDs', 0.0),
    createData('KitKat', 'YASUDA_FRIENDs', 26.0),
    createData('Lollipop', 'YASUDA_FRIENDs', 0.2),
    createData('Marshmallow', 'YASUDA_FRIENDs', 0),
    createData('Nougat', 'YASUDA_FRIENDs', 19.0),
    createData('Oreo', 'YASUDA_FRIENDs', 18.0)
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'File name'
    },
    {
        id: 'createdBy',
        numeric: false,
        disablePadding: false,
        label: 'User'
    },
    {
        id: 'date',
        numeric: true,
        disablePadding: false,
        label: 'Date'
    }
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead
            sx={{
                borderWidth: '1px 1px 0px 1px',
                borderStyle: 'solid',
                borderColor: '#E6E9E9',
                backgroundColor: '#F3F4F4',
                borderRadius: '4px 4px 0px 0px',
                borderTopLeftRadius: '4px',
                color: '#092625'
            }}
        >
            <TableRow sx={{ padding: '8px !important' }}>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sx={{ padding: '8px !important', borderRadius: '4px 4px 0px 0px' }}
                        align={'center'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

export default function AttachmentListTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('createdBy');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const docData = useSelector((state) => state.document.data);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage]
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Scrollbar>
                    <TableContainer>
                        <Table sx={{ minWidth: 707, border: '1px solid #E6E9E9' }} aria-labelledby="tableTitle" size={'medium'}>
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody sx={{}}>
                                {docData &&
                                    docData.attachments &&
                                    docData.attachments.map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.name)}
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.name}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell component="th" id={labelId} scope="row" padding="2.5">
                                                    <Stack direction="row">
                                                        {(() => {
                                                            switch (row.file_extension) {
                                                                case '.pdf':
                                                                    return <IconPdf fontSize="inherit" />;
                                                                case '.xls':
                                                                    return <IconXls fontSize="inherit" />;
                                                                case '.xlsx':
                                                                    return <IconXls fontSize="inherit" />;
                                                                case '.doc':
                                                                    return <IconDocx fontSize="inherit" />;
                                                                case '.docx':
                                                                    return <IconDocx fontSize="inherit" />;
                                                                case '.ppt':
                                                                    return <IconPptx fontSize="inherit" />;
                                                                case '.pptx':
                                                                    return <IconPptx fontSize="inherit" />;
                                                                case '.jpg':
                                                                    return <IconImg fontSize="inherit" />;
                                                                case '.jpeg':
                                                                    return <IconImg fontSize="inherit" />;
                                                                case '.png':
                                                                    return <IconImg fontSize="inherit" />;
                                                                case '.gif':
                                                                    return <IconGif fontSize="inherit" />;
                                                                default:
                                                                    return (
                                                                        <DescriptionIcon
                                                                            fontSize="inherit"
                                                                            sx={{ height: '24px', width: '24px' }}
                                                                        />
                                                                    );
                                                            }
                                                        })()}
                                                        <Typography> {row.file_name}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">{'YASUDA_FRIENDs'}</TableCell>
                                                <TableCell align="center" sx={{ paddingRight: '40px' }}>
                                                    {format(Date.parse(row.uploaded_at), 'dd/LL/yyyy')}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Paper>
        </Box>
    );
}
