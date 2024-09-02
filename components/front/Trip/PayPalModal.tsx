import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import PayPalButton from '@/components/PayPalButton';

interface PayPalModalProps {
  open: boolean;
  handleClose: () => void;
  tripId: string;
  ownerId: string;
  amount: number;
}

const PayPalModal: React.FC<PayPalModalProps> = ({ open, handleClose, tripId, ownerId, amount }) => {
  const [persons, setPersons] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showPayPal, setShowPayPal] = useState<boolean>(false);

  const handlePersonsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersons(Number(event.target.value));
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handleShowPayPal = () => {
    if (phoneNumber && persons > 0) {
      setShowPayPal(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 400, 
        bgcolor: 'background.paper', 
        borderRadius: 2, 
        boxShadow: 24, 
        p: 4 
      }}>
        <Typography 
          id="payment-modal-title" 
          variant="h6" 
          component="h2" 
          sx={{ textAlign: 'center', marginBottom: 2 }}
        >
          Complete Your Payment
        </Typography>
        <TextField
          label="Phone Number"
          type="text"
          fullWidth
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          sx={{ marginBottom: 3 }}
          disabled={ showPayPal?true:false}

        />
        <TextField
          label="Number of Persons"
          type="number"
          fullWidth
          value={persons}
          onChange={handlePersonsChange}
          inputProps={{ min: 1 }}
          sx={{ marginBottom: 3 }}
          disabled={ showPayPal?true:false}
          
        />
        {!showPayPal && (
          <Button 
            onClick={handleShowPayPal} 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ marginTop: 2 }}
          >
            Continue to Payment
          </Button>
        )}
        {showPayPal && (
          <PayPalButton 
            id={tripId} 
            ownerId={ownerId} 
            persons={persons}
            phone={phoneNumber}
            amount={amount * persons} 
          />
        )}
        <Button 
          onClick={handleClose} 
          variant="outlined" 
          color="secondary" 
          fullWidth 
          sx={{ marginTop: 2 }}
        >
          Cancel
        </Button>
        <Typography sx={{ marginTop: 2, textAlign: 'center' }}>
          Total Price: ${(amount * persons).toFixed(2)}
        </Typography>
      </Box>
    </Modal>
  );
};

export default PayPalModal;
