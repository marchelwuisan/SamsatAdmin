import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  LinearProgress,
  SvgIcon,
  TextField,
  TableBody,
  Collapse,
  Typography
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Search as SearchIcon } from 'react-feather';
import { makeStyles } from '@material-ui/styles';
import useTable from "../../components/useTable";
import firebase from '../../config/firebase';
import { VehicleForm, Row } from '../../components/molecules';
import { useDispatch, useSelector } from "react-redux";

const headCells = [
  { id: 'arrow', label: ''},
  { id: 'NO', label: 'FB Index'},
  { id: 'NOMOR_MESIN', label: 'Nomor Mesin' },
  { id: 'NAMA_PEMILIK', label: 'Nama Pemilik' },
  { id: 'BERLAKU_SD', label: 'Berlaku Sampai Dengan' },
  { id: 'NOMOR_POLISI', label: 'Nomor Polisi' },
  { id: 'status', label: ''}
]

const Dashboard = () => {

  let vehicles = useSelector(state => state.vehicles);
  let vehiclesStatus = useSelector(state => state.vehiclesStatus);
  let search = useSelector(state => state.search);
  const dispatch = useDispatch();

  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [isChecked, setIsChecked] = useState(false);

  const handleSearch = e => {
    dispatch({type: 'SEARCH', value:e})
    let target = e;
    setFilterFn({
        fn: items => {
            if (target == "")
                return items;
            else
                return items.filter(x => (x.NO + x.NAMA_PEMILIK + x.NOMOR_MESIN + (x.KODE_DAERAH_NOMOR_POLISI + ' ' + x.NOMOR_POLISI + ' ' + x.KODE_LOKASI_NOMOR_POLISI)).toLowerCase().includes(target.toLowerCase()))
        }
    })
  }

  function getFirebaseVehicles(loop, dataAmount, vehiclesTemp) {

    firebase
      .database()
        .ref(`/vehicles/`)
          .orderByKey()
            .startAt(`${(loop * dataAmount)}`)
            .limitToFirst(dataAmount)
            .once('value')
            .then(res => {
              if(res.val() !== null){
                var vehiclesRes = Object.values(res.val()).filter(n => n);
                vehiclesRes.map((e, index) => {
                  e["index"] = (index + (loop * dataAmount));
                  vehiclesTemp = [...vehiclesTemp, e]
                })
                dispatch({type: 'LOAD_VEHICLES', value:vehiclesTemp})
                loop = loop + 1;
                getFirebaseVehicles(loop, dataAmount, vehiclesTemp)
                
              }
            })
  }

  useEffect(()=>{
    if(vehiclesStatus === false){
        firebase
        .database()
          .ref(`/vehicles/`)
                  .on('value', res => {
                      let vehiclesRes = Object.values(res.val());
                      let vehiclesTemp = [];
                      dispatch({type: 'LOAD_VEHICLES', value:vehiclesRes})
                    })

        // getFirebaseVehicles(0, 5000, [])

    }

    if(search===""){
      handleSearch(" ");
    } else {
      handleSearch(search);
    }
  }, [vehiclesStatus])
  
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(vehicles, headCells, filterFn);

  return(
    <>
      <Helmet>
        <title>Samsat Admin Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
      <Container maxWidth={false}>
        <Box> 
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} >
            <Button color="primary" variant="contained" onClick={() => { setIsChecked((prev) => !prev); }} >
              Tambah Kendaraan
            </Button>
          </Box>
            <Collapse in={isChecked}>
          <Box sx={{ mt: 3 }}>
              <VehicleForm/>
          </Box>
            </Collapse>
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ maxWidth: 500 }}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon fontSize="small" color="action" >
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    value={search}
                    placeholder="Cari Kendaraan"
                    variant="outlined"
                    onChange={(val) => handleSearch(val.target.value)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Box sx={{ pt: 3 }}>
          <Grid container spacing={3} alignItems="center" justify="center">
            <Grid item xs={12} >
            <Card >
              <PerfectScrollbar>
                <Box sx={{ minWidth: 800 }}>
                  <TblContainer>
                      <TblHead />
                      <TableBody>
                        {
                          recordsAfterPagingAndSorting().map((vehicle, index) => {
                            const months = [
                              'JANUARI',
                              'FEBRUARI',
                              'MARET',
                              'APRIL',
                              'MEI',
                              'JUNI',
                              'JULI',
                              'AGUSTUS',
                              'SEPTEMBER',
                              'OKTOBER',
                              'NOVEMBER',
                              'DESEMBER',
                            ];
                            var selectedMonthName = months[vehicle.BULAN_BERLAKU_SD-1];
                            vehicle['tanggalBerlaku'] = vehicle.TANGGAL_BERLAKU_SD + ' ' + selectedMonthName + ' ' + vehicle.TAHUN_BERLAKU_SD;
                            
                            vehicle['nomorPolisi'] = vehicle.KODE_DAERAH_NOMOR_POLISI + ' ' + vehicle.NOMOR_POLISI + ' ' + vehicle.KODE_LOKASI_NOMOR_POLISI;

                            return (
                              <Row key={vehicle.NO} vehicle={vehicle} index={index}/>
                            )
                          })
                        }
                      </TableBody>
                  </TblContainer>
                  {vehiclesStatus ? null :
                    <CircularProgress sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginY: 3,
                      marginX: "50%"
                    }}/>
                    }
                  <TblPagination />
                </Box>
              </PerfectScrollbar>
            </Card>
            </Grid>
          </Grid>
        </Box>
        </Container>
      </Box>
    </>
)};

export default Dashboard;
