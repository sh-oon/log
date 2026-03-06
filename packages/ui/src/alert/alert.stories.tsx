import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDefaultIcon, AlertDescription, AlertIcon, AlertTitle } from './alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Alert' },
  render: () => (
    <Alert variant="default">
      <AlertIcon>
        <AlertDefaultIcon variant="default" />
      </AlertIcon>
      <div>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
      </div>
    </Alert>
  ),
};

export const Variants: Story = {
  args: { children: 'Alert' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default">
        <AlertIcon>
          <AlertDefaultIcon variant="default" />
        </AlertIcon>
        <div>
          <AlertTitle>Default</AlertTitle>
          <AlertDescription>This is a default alert for general information.</AlertDescription>
        </div>
      </Alert>
      <Alert variant="success">
        <AlertIcon>
          <AlertDefaultIcon variant="success" />
        </AlertIcon>
        <div>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your changes have been saved successfully.</AlertDescription>
        </div>
      </Alert>
      <Alert variant="warning">
        <AlertIcon>
          <AlertDefaultIcon variant="warning" />
        </AlertIcon>
        <div>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Your session is about to expire in 5 minutes.</AlertDescription>
        </div>
      </Alert>
      <Alert variant="error">
        <AlertIcon>
          <AlertDefaultIcon variant="error" />
        </AlertIcon>
        <div>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
        </div>
      </Alert>
      <Alert variant="info">
        <AlertIcon>
          <AlertDefaultIcon variant="info" />
        </AlertIcon>
        <div>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>A new software update is available for download.</AlertDescription>
        </div>
      </Alert>
    </div>
  ),
};

export const WithoutIcon: Story = {
  args: { children: 'Alert' },
  render: () => (
    <Alert variant="info">
      <div>
        <AlertTitle>No icon alert</AlertTitle>
        <AlertDescription>
          This alert does not include an icon, only title and description.
        </AlertDescription>
      </div>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  args: { children: 'Alert' },
  render: () => (
    <Alert variant="warning">
      <AlertIcon>
        <AlertDefaultIcon variant="warning" />
      </AlertIcon>
      <div>
        <AlertTitle>Your trial expires in 3 days</AlertTitle>
      </div>
    </Alert>
  ),
};
