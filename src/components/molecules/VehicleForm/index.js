import React, { useState, useEffect, Fragment } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { useForm } from '../../../utils'
import { makeStyles } from '@material-ui/styles';
import firebase from '../../../config/firebase';
import { useDispatch, useSelector } from "react-redux";

const VehicleForm = () => {
    const dispatch = useDispatch();
    let totalVehicle = useSelector(state => state.totalVehicle);
    let vehicles = useSelector(state => state.vehicles);

    const [nomorMesin, setNomorMesin] = useState("")

    useEffect(() => {
        firebase
            .database()
                .ref(`/_TotalVehicle/`)
                    .once('value')
                    .then(res => {
                        dispatch({type: 'TOTAL_VEHICLE', value:res.val()})
                        
                        console.log("totalVehicle: ", res.val())})
    }, [])

    const [form, setForm] = useForm({
        NO: (totalVehicle + 1),
        ID: (nomorMesin),
        NOMOR_MESIN: (nomorMesin),
        KODE_DAERAH_NOMOR_POLISI: 'DB',
        NOMOR_POLISI: 0,
        KODE_LOKASI_NOMOR_POLISI: '',
        NAMA_PEMILIK: '',
        TANGGAL_BERLAKU_SD: 0,
        BULAN_BERLAKU_SD: 0,
        TAHUN_BERLAKU_SD: 0,
        ALAMAT_PEMILIK: '',
        BAHAN_BAKAR: '',
        ISI_SILINDER: 0,
        JENIS_KB: '',
        MEREK_KB: '',
        MODEL_KB: '',
        NOMOR_RANGKA: '',
        PKB_TERAKHIR: '',
        PLAT: '',
        TAHUN_BUAT: 0,
        TYPE_KB: '',
      });

    const handleSubmit = (e) => {
        form["NOMOR_MESIN"] = nomorMesin;
        form["ID"] = nomorMesin;
        form["NO"] = totalVehicle + 1;
        console.log("form: ", form)

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
                                console.log("form: ", form)
                                dispatch({type: 'TOTAL_VEHICLE', value: res.val()})
                                dispatch({type: 'ADD_VEHICLE', value: form})
                            })
                    })
            })

        e.preventDefault(); 
    }

    // const onChangeNomorMesin = (e) => {
    //     const ID = e;
    //     setForm('ID', ID);
    //     setForm('NOMOR_MESIN', e);
    // }

    return(
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>

                <Typography variant="h4" gutterBottom>
                Tambah Kendaraan
                </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    {/* <TextField type="hidden" variant="standard" id="NO" value={totalVehicle + 1} onChange={(e) => setForm('NO', e.target.value.toUpperCase())} /> */}
                    {/* <TextField type="hidden" variant="standard" id="ID" value={form.NOMOR_MESIN} onChange={(e) => setNomorMesin(e)} /> */}
                    <TextField size="small" required id="NOMOR_MESIN" label="Nomor Mesin" fullWidth 
                        onChange={(e) => setNomorMesin(e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" defaultValue="DB" required id="KODE_DAERAH_NOMOR_POLISI" label="Kode Daerah" fullWidth 
                        onChange={(e) => setForm('KODE_DAERAH_NOMOR_POLISI', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="NOMOR_POLISI" type="number" label="Nomor Polisi" fullWidth 
                        onChange={(e) => setForm('NOMOR_POLISI', e.target.value)} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="KODE_LOKASI_NOMOR_POLISI" label="Kode Lokasi" fullWidth 
                        onChange={(e) => setForm('KODE_LOKASI_NOMOR_POLISI', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NAMA_PEMILIK" label="Nama Pemilik" fullWidth 
                        onChange={(e) => setForm('NAMA_PEMILIK', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="TANGGAL_BERLAKU_SD" type="number" label="Hari" fullWidth 
                        onChange={(e) => setForm('TANGGAL_BERLAKU_SD', e.target.value)} InputProps={{ inputProps: {  max: 31, min: 1  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="BULAN_BERLAKU_SD" type="number" label="Bulan" fullWidth 
                        onChange={(e) => setForm('BULAN_BERLAKU_SD', e.target.value)} InputProps={{ inputProps: {  max: 12, min: 1  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField size="small" required id="TAHUN_BERLAKU_SD" type="number" label="Tahun" fullWidth 
                        onChange={(e) => setForm('TAHUN_BERLAKU_SD', e.target.value)} InputProps={{ inputProps: {  max: 3000, min: 1800  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField size="small" required id="ALAMAT_PEMILIK" multiline label="Alamat Pemilik" fullWidth 
                        onChange={(e) => setForm('ALAMAT_PEMILIK', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="BAHAN_BAKAR" label="Bahan Bakar" fullWidth 
                        onChange={(e) => setForm('BAHAN_BAKAR', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="ISI_SILINDER" label="Isi Silinder" fullWidth 
                        onChange={(e) => setForm('ISI_SILINDER', e.target.value)} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="JENIS_KB" label="Jenis KB" fullWidth 
                        onChange={(e) => setForm('JENIS_KB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="MEREK_KB" label="Merek KB" fullWidth 
                        onChange={(e) => setForm('MEREK_KB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="MODEL_KB" label="Model KB" fullWidth 
                        onChange={(e) => setForm('MODEL_KB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="NOMOR_RANGKA" label="Nomor Rangka" fullWidth 
                        onChange={(e) => setForm('NOMOR_RANGKA', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="PKB_TERAKHIR" label="PKB Terakhir" fullWidth 
                        onChange={(e) => setForm('PKB_TERAKHIR', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="PLAT" label="Plat" fullWidth 
                        onChange={(e) => setForm('PLAT', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="TAHUN_BUAT" type="number" label="Tahun Buat" fullWidth 
                        onChange={(e) => setForm('TAHUN_BUAT', e.target.value)} InputProps={{ inputProps: {  max: 3000, min: 1800  } }} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField size="small" required id="TYPE_KB" label="Type KB" fullWidth 
                        onChange={(e) => setForm('TYPE_KB', e.target.value.toUpperCase())} InputLabelProps={{ required: false }}/>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained"> Submit </Button>
                </Grid>
                </Grid>
                </form>
            </CardContent>
        </Card>
    )
}

export default VehicleForm