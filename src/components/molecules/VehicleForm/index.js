import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core';
import { useForm } from '../../../utils'
import Alert from '@material-ui/lab/Alert';
import firebase from '../../../config/firebase';
import { useDispatch, useSelector } from "react-redux";

const VehicleForm = () => {
    const dispatch = useDispatch();
    let totalVehicle = useSelector(state => state.totalVehicle);
    let vehicles = useSelector(state => state.vehicles);

    const [nomorMesin, setNomorMesin] = useState("")

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [severity, setSeverity] = useState('');
    const handleClickAlert = (message, severity) => {
        setSeverity(severity);
        setAlertMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setOpenAlert(false);
    };

    useEffect(() => {
        firebase
            .database()
                .ref(`/_TotalVehicle/`)
                    .once('value')
                    .then(res => {
                        dispatch({type: 'TOTAL_VEHICLE', value:res.val()})
                        
                        })
    }, [])

    const [form, setForm] = useForm({
        NO: (totalVehicle + 1),
        ID: (nomorMesin),
        NOMOR_MESIN: (nomorMesin),
        KODE_DAERAH_NOMOR_POLISI: 'DB',
        NOMOR_POLISI: '',
        KODE_LOKASI_NOMOR_POLISI: '',
        NAMA_PEMILIK: '',
        TANGGAL_BERLAKU_SD: '',
        BULAN_BERLAKU_SD: '',
        TAHUN_BERLAKU_SD: '',
        ALAMAT_PEMILIK: '',
        BAHAN_BAKAR: '',
        ISI_SILINDER: '',
        JENIS_KB: '',
        MEREK_KB: '',
        MODEL_KB: '',
        NOMOR_RANGKA: '',
        PKB_TERAKHIR: '',
        PLAT: '',
        TAHUN_BUAT: '',
        TYPE_KB: '',
      });

    const handleSubmit = (e) => {
        form["NOMOR_MESIN"] = nomorMesin;
        form["ID"] = nomorMesin;
        form["NO"] = totalVehicle + 1;

        firebase
        .database()
        .ref(`vehicles/${totalVehicle}/`)
        .set(form)
        .then(() => {
            firebase
            .database()
            .ref(`/_TotalVehicle/`)
            .set(totalVehicle + 1)
                    .then(() => {
                        firebase
                        .database()
                        .ref(`/_TotalVehicle/`)
                            .once('value')
                            .then(res => {
                                form["index"] = vehicles.length;
                                dispatch({type: 'TOTAL_VEHICLE', value: res.val()})
                                // dispatch({type: 'ADD_VEHICLE', value: form})
                                setForm('reset')
                                setNomorMesin('')
                                handleClickAlert("Vehicle Submitted.", "success")
                            })
                            .catch(error => {
                                handleClickAlert(error.message, "error")
                            });
                    })

            })

        e.preventDefault(); 
    }

    return(
        <>
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>

                <Typography variant="h4" gutterBottom>
                Tambah Kendaraan
                </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NOMOR_MESIN" label="Nomor Mesin" fullWidth value={nomorMesin}
                        onChange={(e) => setNomorMesin(e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="KODE_DAERAH_NOMOR_POLISI" label="Kode Daerah" fullWidth value={form.KODE_DAERAH_NOMOR_POLISI} 
                        onChange={(e) => setForm('KODE_DAERAH_NOMOR_POLISI', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="NOMOR_POLISI" type="number" label="Nomor Polisi" fullWidth value={form.NOMOR_POLISI}
                        onChange={(e) => setForm('NOMOR_POLISI', e.target.value)} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="KODE_LOKASI_NOMOR_POLISI" label="Kode Lokasi" fullWidth value={form.KODE_LOKASI_NOMOR_POLISI}
                        onChange={(e) => setForm('KODE_LOKASI_NOMOR_POLISI', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NAMA_PEMILIK" label="Nama Pemilik" fullWidth value={form.NAMA_PEMILIK}
                        onChange={(e) => setForm('NAMA_PEMILIK', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="TANGGAL_BERLAKU_SD" type="number" label="Hari" fullWidth value={form.TANGGAL_BERLAKU_SD}
                        onChange={(e) => setForm('TANGGAL_BERLAKU_SD', e.target.value)} InputProps={{ inputProps: {  max: 31, min: 1  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="BULAN_BERLAKU_SD" type="number" label="Bulan" fullWidth value={form.BULAN_BERLAKU_SD}
                        onChange={(e) => setForm('BULAN_BERLAKU_SD', e.target.value)} InputProps={{ inputProps: {  max: 12, min: 1  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="TAHUN_BERLAKU_SD" type="number" label="Tahun" fullWidth value={form.TAHUN_BERLAKU_SD}
                        onChange={(e) => setForm('TAHUN_BERLAKU_SD', e.target.value)} InputProps={{ inputProps: {  max: 3000, min: 1800  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField size="small" required id="ALAMAT_PEMILIK" multiline label="Alamat Pemilik" fullWidth value={form.ALAMAT_PEMILIK}
                        onChange={(e) => setForm('ALAMAT_PEMILIK', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="BAHAN_BAKAR" label="Bahan Bakar" fullWidth value={form.BAHAN_BAKAR}
                        onChange={(e) => setForm('BAHAN_BAKAR', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="ISI_SILINDER" label="Isi Silinder" fullWidth value={form.ISI_SILINDER}
                        onChange={(e) => setForm('ISI_SILINDER', e.target.value)} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="JENIS_KB" label="Jenis KB" fullWidth value={form.JENIS_KB}
                        onChange={(e) => setForm('JENIS_KB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="MEREK_KB" label="Merek KB" fullWidth value={form.MEREK_KB}
                        onChange={(e) => setForm('MEREK_KB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="MODEL_KB" label="Model KB" fullWidth value={form.MODEL_KB}
                        onChange={(e) => setForm('MODEL_KB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NOMOR_RANGKA" label="Nomor Rangka" fullWidth value={form.NOMOR_RANGKA}
                        onChange={(e) => setForm('NOMOR_RANGKA', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="PKB_TERAKHIR" label="PKB Terakhir" fullWidth value={form.PKB_TERAKHIR}
                        onChange={(e) => setForm('PKB_TERAKHIR', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="PLAT" label="Plat" fullWidth value={form.PLAT}
                        onChange={(e) => setForm('PLAT', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="TAHUN_BUAT" type="number" label="Tahun Buat" fullWidth value={form.TAHUN_BUAT}
                        onChange={(e) => setForm('TAHUN_BUAT', e.target.value)} InputProps={{ inputProps: {  max: 3000, min: 1800  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="TYPE_KB" label="Type KB" fullWidth value={form.TYPE_KB}
                        onChange={(e) => setForm('TYPE_KB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained"> Submit </Button>
                </Grid>
                </Grid>
                </form>
            </CardContent>
        </Card>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={severity}>
                {alertMessage}
            </Alert>
      </Snackbar>
        </>
    )
}

export default VehicleForm