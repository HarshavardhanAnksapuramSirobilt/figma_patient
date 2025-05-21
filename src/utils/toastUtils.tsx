// src/utils/toastUtils.tsx
import React from "react";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

/**
 * Show a success toast for patient registration
 * @param fullName - Full name of the registered patient
 */
export const showSuccess = (message: string, fullName: string): void => {
    toast.success(
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <FaCheckCircle style={{ color: 'green', marginTop: '4px' }} />
            <div>
                <strong>{message}</strong><br />
                Patient <span style={{ fontWeight: 600 }}>{fullName}</span> registered.
            </div>
        </div>,
        {
            style: {
                backgroundColor: '#edfcf2',
                border: '1px solid #16a34a',
                color: '#1f2937',
                borderRadius: '10px',
                padding: '12px'
            },
            icon: false,
            position: "top-right",
            autoClose: 3000
        }
    );
};

/**
 * Show an error toast for patient registration failure
 * @param message - Main error message
 * @param fullName - Full name of the patient that failed to register
 */
export const showError = (message: string, fullName: string): void => {
    toast.error(
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <FaTimesCircle style={{ color: 'red', marginTop: '4px' }} />
            <div>
                <strong>{message}</strong><br />
                Failed to register patient <span style={{ fontWeight: 600 }}>{fullName}</span>.
            </div>
        </div>,
        {
            style: {
                backgroundColor: '#fef2f2',
                border: '1px solid #dc2626',
                color: '#1f2937',
                borderRadius: '10px',
                padding: '12px'
            },
            icon: false,
            position: "top-right",
            autoClose: 3000
        }
    );
};
