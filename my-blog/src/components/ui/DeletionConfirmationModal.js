import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const DeletionConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message }) => {
    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p>{message}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">Cancel</Button>
                <Button onClick={onConfirm} color="secondary">Yes, Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletionConfirmationModal;