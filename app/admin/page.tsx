"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminDashboardPage() {
  // TODO: Fetch summary data (e.g., user count, live streams)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fhsb-cream">Admin Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card border-fhsb-green/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-fhsb-cream">Total Users</CardTitle>
                  {/* Icon */}
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-fhsb-cream">Loading...</div>
                  {/* <p className="text-xs text-muted-foreground">+X% from last month</p> */}
              </CardContent>
          </Card>
          <Card className="bg-card border-fhsb-green/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-fhsb-cream">Live Streams</CardTitle>
                   {/* Icon */}
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-fhsb-cream">Loading...</div>
                  {/* <p className="text-xs text-muted-foreground">Currently active</p> */}
              </CardContent>
          </Card>
           {/* Add more summary cards as needed */}
      </div>

      {/* Add links or quick actions */}
      <p className="text-muted-foreground">
        Select an option from the sidebar to manage users or streams.
      </p>
    </div>
  );
} 