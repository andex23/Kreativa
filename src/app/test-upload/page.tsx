'use client';

import { useState } from 'react';

export default function TestUploadPage() {
    const [result, setResult] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    const testUpload = async () => {
        setIsUploading(true);
        setResult('Testing upload...');

        try {
            // Create a small test image (1x1 red pixel)
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'red';
                ctx.fillRect(0, 0, 1, 1);
            }
            const base64 = canvas.toDataURL('image/jpeg');

            const response = await fetch('/api/test-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64Image: base64 })
            });

            const data = await response.json();
            setResult(JSON.stringify(data, null, 2));
        } catch (error: any) {
            setResult(`Error: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Upload Test</h1>
            <p>Test if image upload to Supabase Storage is working</p>

            <button
                onClick={testUpload}
                disabled={isUploading}
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    backgroundColor: isUploading ? '#ccc' : '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px'
                }}
            >
                {isUploading ? 'Testing...' : 'Test Upload'}
            </button>

            {result && (
                <pre style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    overflow: 'auto'
                }}>
                    {result}
                </pre>
            )}

            <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#666' }}>
                <h3>What this tests:</h3>
                <ul>
                    <li>✓ Supabase connection</li>
                    <li>✓ Service role key is valid</li>
                    <li>✓ Storage buckets exist</li>
                    <li>✓ Upload permissions work</li>
                </ul>
            </div>
        </div>
    );
}
