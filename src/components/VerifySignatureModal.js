import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const VerifySignatureModal = ({ isOpen, onRequestClose, order }) => {
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSignature(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setSignature(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/verify-signature', {
        orderId: order._id,
        signature,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.valid) {
        alert('Signature verified successfully!');
        onRequestClose();
      } else {
        setError('Signature is invalid. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during verification. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Verify Signature</h2>
      <div>
        <p>Please upload your signature file to verify the order:</p>
        <input type="file" accept=".pem,.txt" onChange={handleFileUpload} />
        <textarea
          value={signature}
          onChange={handleInputChange}
          rows={10}
          cols={50}
        />
        {error && <p className="text-danger">{error}</p>}
        <button onClick={handleVerify}>Verify</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default VerifySignatureModal;