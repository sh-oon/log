import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { ToastProvider, toast } from './toast';

function ToastDemo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-3">
      {children}
      <ToastProvider />
    </div>
  );
}

const meta = {
  title: 'Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastDemo>
        <Story />
      </ToastDemo>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast('Event has been created')}
      data-test-id="toast-trigger-default"
    >
      Show Toast
    </Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.success('Successfully saved!')}
      data-test-id="toast-trigger-success"
    >
      Success Toast
    </Button>
  ),
};

export const ErrorToast: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.error('Something went wrong')}
      data-test-id="toast-trigger-error"
    >
      Error Toast
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.warning('Please review your input')}
      data-test-id="toast-trigger-warning"
    >
      Warning Toast
    </Button>
  ),
};

export const Info: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.info('New update available')}
      data-test-id="toast-trigger-info"
    >
      Info Toast
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('Event created', {
          description: 'Monday, January 3rd at 6:00pm',
        })
      }
      data-test-id="toast-trigger-description"
    >
      Toast with Description
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('File deleted', {
          action: {
            label: 'Undo',
            onClick: () => toast('File restored'),
          },
        })
      }
      data-test-id="toast-trigger-action"
    >
      Toast with Action
    </Button>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(
          new Promise<{ name: string }>((resolve) =>
            setTimeout(() => resolve({ name: 'Sonner' }), 2000)
          ),
          {
            loading: 'Loading...',
            success: 'Done!',
            error: 'Error!',
          }
        )
      }
      data-test-id="toast-trigger-promise"
    >
      Promise Toast
    </Button>
  ),
};

export const Positions: Story = {
  render: () => {
    const positions = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ] as const;

    return (
      <div className="flex flex-wrap gap-3">
        {positions.map((position) => (
          <Button
            key={position}
            variant="outline"
            size="sm"
            onClick={() =>
              toast(`Toast at ${position}`, {
                position,
              })
            }
            data-test-id={`toast-trigger-position-${position}`}
          >
            {position}
          </Button>
        ))}
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() => toast('Default toast')}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success('Success toast')}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Error toast')}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning('Warning toast')}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Info toast')}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.loading('Loading...')}
        data-test-id="toast-trigger-loading"
      >
        Loading
      </Button>
    </div>
  ),
};
