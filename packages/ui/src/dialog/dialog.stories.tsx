import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OverlayProvider } from 'overlay-kit';
import { fn } from 'storybook/test';
import { Button } from '../button';
import { Input } from '../input';
import { Text } from '../text';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  openDialog,
} from './dialog';

const meta = {
  title: 'Feedback/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: {
    isOpen: false,
    onClose: fn(),
    size: 'md',
    children: null,
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Default Dialog</DialogTitle>
            <DialogDescription>
              This is a basic dialog with a title and description.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Text
              as="p"
              typography="text-sm-regular"
              color="foreground"
            >
              Dialog body content goes here.
            </Text>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};

// ---------------------------------------------------------------------------
// WithOverlayKit
// ---------------------------------------------------------------------------

function OverlayKitDemo() {
  return (
    <Button
      onClick={() => {
        openDialog({
          title: 'Overlay Kit Dialog',
          description: 'This dialog was opened imperatively using overlay-kit.',
          size: 'md',
          content: (close) => (
            <>
              <div className="py-4">
                <Text
                  as="p"
                  typography="text-sm-regular"
                  color="foreground"
                >
                  This dialog is managed by overlay-kit. Click the buttons below or the X to close
                  it.
                </Text>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={close}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </>
          ),
        });
      }}
    >
      Open with overlay-kit
    </Button>
  );
}

export const WithOverlayKit: Story = {
  render: () => (
    <OverlayProvider>
      <OverlayKitDemo />
    </OverlayProvider>
  ),
};

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

export const Sizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = useState<'sm' | 'md' | 'lg' | null>(null);
    return (
      <>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenSize('sm')}
          >
            Small
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenSize('md')}
          >
            Medium
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenSize('lg')}
          >
            Large
          </Button>
        </div>
        {openSize && (
          <Dialog
            isOpen
            onClose={() => setOpenSize(null)}
            size={openSize}
          >
            <DialogHeader>
              <DialogTitle>{openSize.toUpperCase()} Dialog</DialogTitle>
              <DialogDescription>This dialog uses size=&quot;{openSize}&quot;.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Text
                as="p"
                typography="text-sm-regular"
                color="foreground"
              >
                The max-width changes based on the size prop.
              </Text>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => setOpenSize(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </Dialog>
        )}
      </>
    );
  },
};

// ---------------------------------------------------------------------------
// WithForm
// ---------------------------------------------------------------------------

function WithFormDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const nameId = useId();
  const emailId = useId();
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Form Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
      >
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
          <DialogDescription>Fill in the details below to create a new item.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        >
          <label
            htmlFor={nameId}
            className="flex flex-col gap-1"
          >
            <Text
              as="span"
              typography="text-sm-regular"
              color="foreground"
            >
              Name
            </Text>
            <Input
              id={nameId}
              placeholder="Enter name"
            />
          </label>
          <label
            htmlFor={emailId}
            className="flex flex-col gap-1"
          >
            <Text
              as="span"
              typography="text-sm-regular"
              color="foreground"
            >
              Email
            </Text>
            <Input
              id={emailId}
              type="email"
              placeholder="Enter email"
            />
          </label>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
          >
            Create
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export const WithForm: Story = {
  render: () => <WithFormDemo />,
};

// ---------------------------------------------------------------------------
// Confirmation
// ---------------------------------------------------------------------------

export const Confirmation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          Delete Item
        </Button>
        <Dialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="sm"
        >
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the item and all associated
              data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};
