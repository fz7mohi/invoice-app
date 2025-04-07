import React, { useState } from 'react';

const TestInput = () => {
    const [value, setValue] = useState('');
    const [rawEvent, setRawEvent] = useState({});

    const handleChange = (e) => {
        // Log the raw event details
        const eventDetails = {
            type: e.type,
            key: e.key,
            keyCode: e.keyCode,
            target: {
                value: e.target.value,
                type: e.target.type,
                inputMode: e.target.inputMode
            }
        };
        setRawEvent(eventDetails);
        setValue(e.target.value);
    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#141625',
            color: '#FFFFFF',
            borderRadius: '8px',
            margin: '20px'
        }}>
            <h2 style={{ marginBottom: '20px', color: '#7C5DFA' }}>Test Input Component</h2>

            {/* Regular input */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                    Regular Input (uncontrolled)
                </label>
                <input
                    type="text"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1E2139',
                        color: '#FFFFFF',
                        border: '1px solid #252945',
                        borderRadius: '4px'
                    }}
                />
            </div>

            {/* Number input */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                    Number Input
                </label>
                <input
                    type="number"
                    step="0.01"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1E2139',
                        color: '#FFFFFF',
                        border: '1px solid #252945',
                        borderRadius: '4px'
                    }}
                />
            </div>

            {/* Text input with decimal mode */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                    Text Input with decimal mode
                </label>
                <input
                    type="text"
                    inputMode="decimal"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1E2139',
                        color: '#FFFFFF',
                        border: '1px solid #252945',
                        borderRadius: '4px'
                    }}
                />
            </div>

            {/* Controlled input with event logging */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                    Controlled Input with Event Logging
                </label>
                <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1E2139',
                        color: '#FFFFFF',
                        border: '1px solid #252945',
                        borderRadius: '4px'
                    }}
                />
                <div style={{ 
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#252945',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap'
                }}>
                    Current value: {value || 'empty'}
                    {'\n'}
                    Raw event: {JSON.stringify(rawEvent, null, 2)}
                </div>
            </div>

            {/* Native HTML input */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                    Native HTML Input (no React)
                </label>
                <div
                    dangerouslySetInnerHTML={{
                        __html: `
                            <input
                                type="text"
                                inputmode="decimal"
                                style="
                                    width: 100%;
                                    padding: 10px;
                                    background-color: #1E2139;
                                    color: #FFFFFF;
                                    border: 1px solid #252945;
                                    border-radius: 4px;
                                "
                            />
                        `
                    }}
                />
            </div>
        </div>
    );
};

export default TestInput; 