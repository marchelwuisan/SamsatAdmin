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
  { id: 'NOMOR_MESIN', label: 'Nomor Mesin' },
  { id: 'NAMA_PEMILIK', label: 'Nama Pemilik' },
  { id: 'BERLAKU_SD', label: 'Berlaku Sampai Dengan' },
  { id: 'NOMOR_POLISI', label: 'Nomor Polisi' },
  { id: 'NO_TELEPON', label: 'Nomor Telepon'},
  { id: 'status', label: ''}
]

const Dashboard = () => {

  let vehicles = useSelector(state => state.vehicles);
  let vehiclesStatus = useSelector(state => state.vehiclesStatus);
  let search = useSelector(state => state.search);
  const dispatch = useDispatch();

  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [isChecked, setIsChecked] = useState(false);

  const handleSearch = target => {
    dispatch({type: 'SEARCH', value:target})
    setFilterFn({
        fn: items => {
            if (target == "")
                return items;
            else {
                console.log("target: ", target)
                return items.filter(x => (x.NAMA_PEMILIK + x.NOMOR_MESIN + x.NOPOL + x.ALAMAT_PEMILIK + x.NOMOR_RANGKA + x.PKB + x.JT_PAJAK + x.NO + x.JENIS).toLowerCase().includes(target.toLowerCase()))
            }
          }
    })
  }

  function getFirebaseVehicles(loop, dataAmount, vehiclesTemp) {

    firebase
      .database()
        .ref(`/Kendaraan/`)
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
          .ref(`/Kendaraan/`)
                  .on('value', res => {
                      console.log("res.val", res.val())
                      let vehiclesRes = Object.values(res.val());
                      console.log("Object resval: ", vehiclesRes)
                      let vehiclesTemp = [];
                      dispatch({type: 'LOAD_VEHICLES', value:vehiclesRes})
                    })

        // getFirebaseVehicles(0, 4999, [])

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
                            return (
                              <Row key={vehicle.NOPOL} vehicle={vehicle} index={index}/>
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
