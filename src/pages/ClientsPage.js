import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  CircularProgress // Importación del CircularProgress para el indicador de carga
} from '@mui/material';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import CoplandFileManagerApi from '../services/coplandFileManager';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'format', label: 'Formato', alignRight: false },
  { id: 'category', label: 'Categoria', alignRight: false },
  { id: 'uploadTime', label: 'Fecha de creación', alignRight: false },
  { id: 'view', label: 'Ver archivo', alignRight: true },
  { id: '' },
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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clients, setClients] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  const fetchClients = async (page, pageSize) => {
    try {
      setLoading(true); // Activar la carga antes de la solicitud
      const response = await CoplandFileManagerApi.getFiles(page, pageSize);
      const { data, headers } = response;
      const { 'x-pagination-total-pages': total, 'x-pagination-has-next-page': hasNext } = headers;
      if (hasNext) {
        setTotalPages(total);
      } else {
        setTotalPages(1);
      }
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false); // Desactivar la carga después de la solicitud (tanto en éxito como en error)
    }
  };

  useEffect(() => {
    fetchClients(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleOpenMenu = (event, selectedUser) => {
    setOpen(event.currentTarget);
    setCurrentUserId(selectedUser.id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setCurrentUserId(null);
  };

  const handleEditUser = () => {
    if (currentUserId) {
      navigate(`/dashboard/clientes/editar/${currentUserId}`);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = clients.map((n) => n.name);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const mapCategoryValue = (categoryName) => {
    switch (categoryName) {
      case 0:
        return 'Identidad';
      case 1:
        return 'Salud';
      case 2:
        return 'Estudio';
      case 3:
        return 'Vivienda';
      case 4:
        return 'Otros';
      default:
        return 'Sin categoria';
    }
  };

  const filteredUsers = applySortFilter(clients, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleViewFile = (fileId) => {
    navigate(`/dashboard/files/view?id=${fileId}`);
  };

  return (
    <>
      <Helmet>
        <title>Archivos | AgileDevs</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Archivos
          </Typography>
          <Button variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate(`/dashboard/files/new`)}
          >
            Nuevo Archivo
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={clients.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {applySortFilter(clients, getComparator(order, orderBy), filterName).map((row) => {
                    const { id, name, format, category, uploadTime } = row;
                    const selectedUser = selected.indexOf(name) !== -1;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{format}</TableCell>

                        <TableCell align="left">{mapCategoryValue(category)}</TableCell>

                        <TableCell align="left">{uploadTime}</TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={() => handleViewFile(row.id)}
                          >
                            <Iconify icon={'eva:eye-fill'} />
                          </IconButton>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={e => handleOpenMenu(e, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No encontrado
                          </Typography>

                          <Typography variant="body2">
                            No existen resultados para &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Intenta revisar las erratas o utilizar palabras completas.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => { handleEditUser() }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Popover>

      {loading && ( // Mostrar indicador de carga si loading es verdadero
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </div>
      )}
    </>
  );
}
