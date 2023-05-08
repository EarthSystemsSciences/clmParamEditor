#!/usr/bin/env python
# coding: utf-8

# Copyright (c) qzhang.
# Distributed under the terms of the Modified BSD License.

"""
An widget for editing parameters in a clm parameter file
"""

from ipywidgets import DOMWidget, widget_serialization
from traitlets import Unicode, List, observe, HasTraits, default

from ._frontend import module_name, module_version
import netCDF4
import numpy as np
import os
import getpass
import xarray as xr


class EditCLMParamWidget(DOMWidget, HasTraits):
    """TODO: Add docstring here
    """
    _model_name = Unicode('EditCLMParamModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('EditCLMParamView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    # widget model attributes
    username = Unicode()
    saverequest = Unicode('clickable').tag(sync=True)
    
    clmnc_file = Unicode('data/clm_params_files/clm_params_c180312.nc').tag(sync=True)
    newclmnc_file = Unicode('new_clm_file.nc').tag(sync=True)
    
    # six parameters to expose for editing
    # 0. single value parameter (double) -- allpfts = 1
    r_mort = Unicode('0.02').tag(sync=True)

    # five more traitlets
    slatop = List([]).tag(sync=True)
    flnr = List([]).tag(sync=True)
    frootcn = List([]).tag(sync=True)
    froot_leaf = List([]).tag(sync=True)
    leafcn = List([]).tag(sync=True)

    # To get a default value dynamically, decorate a class method with @default({traitname}).
    @default('username')
    def _username_default(self):
        return getpass.getuser()
    
    # To do something when a trait attribute is changed, decorate a method with traitlets.observe().
    # @observe('saverequest')
    def _on_saverequest_changed(self, change):
        """
        This callback is passed the following dictionary when called:
        {
          'owner': object,  # The HasTraits instance
          'new': 0.03,         # The new value
          'old': 0.02,         # The old value
          'name': "saverequest",    # The name of the changed trait
          'type': 'change', # The event type of the notification, usually 'change'
        }
        """
        print(f"{change.name} changed from {change.old} to {change.new}")
        if change.new == 'save':
            self.save_netCDF_file(self.newclmnc_file)
    
    # @observe('clmnc_file')
    def _on_clmnc_file_changed(self, change):
        # print(f"{change.name} changed from {change.old} to {change.new}")
        self.read_netCDF_data(change.new)
    
    # @observe('r_mort')
    def _on_r_mort_changed(self, change):
        # print(f"{change.name} changed from {change.old} to {change.new}")
        self.send({'event': 'r_mort_changed', 'new_value': change.new})
    # @observe('slatop')
    def _on_slatop_changed(self, change):
        self.send({'event': 'slatop_changed', 'new_value': change.new})
        # print(f"{change.name} changed from {change.old} to {change.new}")

    # @observe('flnr')
    def _on_flnr_changed(self, change):
        self.send({'event': 'flnr_changed', 'new_value': change.new})
        # print(f"{change.name} changed from {change.old} to {change.new}")

    # @observe('frootcn')
    def _on_frootcn_changed(self, change):
        self.send({'event': 'frootcn_changed', 'new_value': change.new})
        # print(f"{change.name} changed from {change.old} to {change.new}")

    # @observe('froot_leaf')
    def _on_froot_leaf_changed(self, change):
        self.send({'event': 'froot_leaf_changed', 'new_value': change.new})
        # print(f"{change.name} changed from {change.old} to {change.new}")

    # @observe('leafcn')
    def _on_leafcn_changed(self, change):
        self.send({'event': 'leafcn_changed', 'new_value': change.new})
        # print(f"{change.name} changed from {change.old} to {change.new}")


    def __init__(self, **kwargs):
        # print("initializing the widget...")
        super().__init__(**kwargs)
        self.read_netCDF_data("./data/clm_params_files/clm_params_c180312.nc")

        """
        These _on_*_changed functions get called whenever the value of the data traitlet changes.
        This method sends a message to the frontend using the self.send method, with a custom event name,
        e.g., 'slatop_changed' and the new value of the slatop traitlet.
        """

        self.observe(self._on_saverequest_changed, names='saverequest')
        self.observe(self._on_clmnc_file_changed, names='clmnc_file')
        self.observe(self._on_r_mort_changed, names='r_mort')
        self.observe(self._on_slatop_changed, names='slatop')
        self.observe(self._on_flnr_changed, names='flnr')
        self.observe(self._on_frootcn_changed, names='frootcn')
        self.observe(self._on_froot_leaf_changed, names='froot_leaf')
        self.observe(self._on_leafcn_changed, names='leafcn')


    def read_netCDF_data(self, clmncfile):
        if clmncfile and os.path.exists(clmncfile):
            # print(f'clm file to read from: {clmncfile}')
            with netCDF4.Dataset(clmncfile, mode='r+') as clm_dataset:
                self.r_mort = str(clm_dataset.variables['r_mort'][:][0])
                self.slatop = clm_dataset.variables['slatop'][:].tolist()
                self.flnr = clm_dataset.variables['flnr'][:].tolist()
                self.frootcn = clm_dataset.variables['frootcn'][:].tolist()
                self.froot_leaf = clm_dataset.variables['froot_leaf'][:].tolist()
                self.leafcn = clm_dataset.variables['leafcn'][:].tolist()
        else:
            print(f'File: {clmncfile} does not exist!')

    def save_netCDF_file(self, new_ncfile):
        # just to be safe, make sure dataset is not already open.
        try: nc_dataset.close()
        except: pass

        # make a copy of the original nc file, so we can update the file
        if new_ncfile == os.path.basename(new_ncfile):
            new_ncfile = os.path.join(os.path.dirname(self.clmnc_file), new_ncfile)

        print(f"Copying the original nc file from {self.clmnc_file}...to {new_ncfile}")
        self.create_file_from_source(self.clmnc_file, new_ncfile)

        # os.chmod(new_ncfile, 0o777)

        if os.path.exists(new_ncfile):
            print(f'Save the modified netCDF data to: {new_ncfile}')
            nc_dataset = netCDF4.Dataset(new_ncfile, mode='r+')
            nc_dataset.variables['r_mort'][:][0] = float(self.r_mort)
            nc_dataset.variables['slatop'][:] = self.slatop
            nc_dataset.variables['flnr'][:] = self.flnr
            nc_dataset.variables['frootcn'][:] = self.frootcn
            nc_dataset.variables['froot_leaf'][:] = self.froot_leaf
            nc_dataset.variables['leafcn'][:] = self.leafcn
            print(f'New parameter file has been saved to {new_ncfile}')

        else:
            print(f'File: {new_ncfile} does not exist!')

        self.saverequest = 'clickable'

    def create_file_from_source(self, src_file, dst_file):
        #input file to Dataset
        with netCDF4.Dataset(src_file) as dsin:
            #output file
            dsout = netCDF4.Dataset(dst_file, "w", format="NETCDF3_CLASSIC")

            #Copy dimensions
            for dname, the_dim in dsin.dimensions.items():
                #print(dname, len(the_dim))
                dsout.createDimension(dname, len(the_dim) if not the_dim.isunlimited() else None)

            # Copy variables
            for v_name, varin in dsin.variables.items():
                outVar = dsout.createVariable(v_name, varin.datatype, varin.dimensions)
                #print(varin.datatype)
    
                # Copy variable attributes
                outVar.setncatts({k: varin.getncattr(k) for k in varin.ncattrs()})   
                outVar[:] = varin[:]
        # close the output file
        dsout.close()
