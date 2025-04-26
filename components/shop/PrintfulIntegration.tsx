import React, { useState } from 'react';
import { Button, Input, Card, message } from 'antd';
import { printfulApi } from '../../lib/api/printful';

interface PrintfulIntegrationProps {
  shopId: string;
  isConnected: boolean;
  onIntegrationUpdate: () => void;
}

export const PrintfulIntegration: React.FC<PrintfulIntegrationProps> = ({
  shopId,
  isConnected,
  onIntegrationUpdate,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await printfulApi.connectStore(shopId, apiKey);
      message.success('Successfully connected to Printful');
      onIntegrationUpdate();
      setApiKey('');
    } catch (error) {
      message.error('Failed to connect to Printful');
      console.error('Printful connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      await printfulApi.syncProducts(shopId);
      message.success('Successfully synced Printful products');
    } catch (error) {
      message.error('Failed to sync Printful products');
      console.error('Printful sync error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await printfulApi.disconnectStore(shopId);
      message.success('Successfully disconnected from Printful');
      onIntegrationUpdate();
    } catch (error) {
      message.error('Failed to disconnect from Printful');
      console.error('Printful disconnection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Printful Integration" className="mb-4">
      <div className="space-y-4">
        {!isConnected ? (
          <div className="space-y-4">
            <p>
              Connect your Printful store to automatically sync your products.
              You can find your API key in your Printful dashboard under Settings
              → API.
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your Printful API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
                type="password"
              />
              <Button
                type="primary"
                onClick={handleConnect}
                loading={loading}
                disabled={!apiKey}
              >
                Connect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Your shop is connected to Printful.</p>
            <div className="flex space-x-2">
              <Button
                onClick={handleSync}
                loading={loading}
                className="flex-1"
              >
                Sync Products
              </Button>
              <Button
                danger
                onClick={handleDisconnect}
                loading={loading}
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}; 