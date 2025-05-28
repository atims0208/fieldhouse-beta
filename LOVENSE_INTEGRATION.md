# Lovense Integration for Fieldhouse

This document provides an overview of the Lovense integration features added to the Fieldhouse streaming platform.

## Overview

The Lovense integration allows streamers to connect their Lovense toys and receive interactive donations from viewers. Viewers can control the streamer's toys by adding toy control parameters to their donations.

## Components

### Backend Components

1. **LovenseToyModel**: Stores information about connected Lovense toys
2. **LovenseCommandModel**: Stores command history for Lovense toys
3. **lovenseService**: Handles communication with the Lovense API
4. **lovenseController**: Provides API endpoints for Lovense integration
5. **lovenseRoutes**: Defines API routes for Lovense integration

### Frontend Components

1. **LovenseConnection**: Component for connecting and managing Lovense toys
2. **LovenseSettings**: Component for configuring Lovense settings for streams
3. **LovenseDonationTrigger**: Component for adding toy control to donations
4. **Lovense Dashboard**: Page for managing Lovense integration

## Features

### For Streamers

1. **Toy Connection**: Connect Lovense toys using QR codes
2. **Stream-specific Settings**: Configure different settings for each stream
   - Enable/disable Lovense integration per stream
   - Set minimum donation amount for toy control
   - Set maximum intensity level
   - Configure allowed commands
   - Create custom vibration patterns
3. **Toy Management**: View connected toys, test them, and disconnect when needed

### For Viewers

1. **Interactive Donations**: Control the streamer's toy when making a donation
   - Select action type (vibrate, rotate, etc.)
   - Adjust intensity level (scaled based on donation amount)
   - Set duration
   - Choose custom patterns (if enabled by the streamer)

## How to Use

### Streamer Setup

1. Navigate to the Lovense dashboard from the main navigation
2. Connect your Lovense toy using the QR code
3. Configure your stream settings:
   - Enable Lovense integration for specific streams
   - Set minimum donation amount
   - Configure allowed commands and patterns
4. Start streaming with Lovense integration enabled

### Viewer Interaction

1. Navigate to a stream with Lovense integration enabled
2. Make a donation above the minimum amount
3. Use the toy control options to customize your interaction
4. Submit your donation to trigger the toy

## Technical Implementation

The integration uses the Lovense API to:
1. Generate QR codes for toy connection
2. Send commands to connected toys
3. Retrieve toy status and information

Commands are sent to toys when donations with toy control parameters are received. The system validates that:
1. The donation meets the minimum amount requirement
2. The command is allowed by the streamer
3. The intensity is within the allowed range based on donation amount

## Security Considerations

1. Toy IDs and connection tokens are stored securely
2. Only the streamer can access their own toy information
3. Command validation prevents abuse of the system
4. Rate limiting is implemented to prevent spam

## Future Enhancements

1. Support for multiple toys per streamer
2. Advanced pattern editor
3. Scheduled toy actions based on stream milestones
4. Integration with stream alerts and events
