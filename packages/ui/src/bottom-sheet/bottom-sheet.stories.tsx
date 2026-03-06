import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OverlayProvider } from 'overlay-kit';
import { fn } from 'storybook/test';
import { Button } from '../button';
import { Text } from '../text';
import {
  BottomSheet,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  openBottomSheet,
} from './bottom-sheet';

const meta = {
  title: 'Feedback/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  args: {
    isOpen: false,
    onClose: fn(),
    snapPoint: 'half',
    children: null,
  },
} satisfies Meta<typeof BottomSheet>;

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
        <Button onClick={() => setIsOpen(true)}>Open Bottom Sheet</Button>
        <BottomSheet
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <BottomSheetHeader>
            <BottomSheetTitle>Default Bottom Sheet</BottomSheetTitle>
            <BottomSheetDescription>
              Drag the handle down to dismiss, or tap the overlay.
            </BottomSheetDescription>
          </BottomSheetHeader>
          <div className="py-4">
            <Text
              as="p"
              typography="text-sm-regular"
              color="foreground"
            >
              Bottom sheet body content goes here.
            </Text>
          </div>
          <BottomSheetFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
      </>
    );
  },
};

// ---------------------------------------------------------------------------
// SnapPoints
// ---------------------------------------------------------------------------

export const SnapPoints: Story = {
  render: () => {
    const [openSnap, setOpenSnap] = useState<'compact' | 'half' | 'full' | null>(null);
    return (
      <>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenSnap('compact')}
          >
            Compact (40vh)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenSnap('half')}
          >
            Half (60vh)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenSnap('full')}
          >
            Full (90vh)
          </Button>
        </div>
        {openSnap && (
          <BottomSheet
            isOpen
            onClose={() => setOpenSnap(null)}
            snapPoint={openSnap}
          >
            <BottomSheetHeader>
              <BottomSheetTitle>{openSnap.toUpperCase()} Snap Point</BottomSheetTitle>
              <BottomSheetDescription>
                This bottom sheet uses snapPoint=&quot;{openSnap}&quot;.
              </BottomSheetDescription>
            </BottomSheetHeader>
            <div className="py-4">
              <Text
                as="p"
                typography="text-sm-regular"
                color="foreground"
              >
                The max-height changes based on the snapPoint prop.
              </Text>
            </div>
            <BottomSheetFooter>
              <Button
                size="sm"
                onClick={() => setOpenSnap(null)}
              >
                Close
              </Button>
            </BottomSheetFooter>
          </BottomSheet>
        )}
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
        openBottomSheet({
          title: 'Overlay Kit Bottom Sheet',
          description: 'This bottom sheet was opened imperatively using overlay-kit.',
          snapPoint: 'half',
          content: (close) => (
            <>
              <div className="py-4">
                <Text
                  as="p"
                  typography="text-sm-regular"
                  color="foreground"
                >
                  This bottom sheet is managed by overlay-kit. Drag down or tap a button to close.
                </Text>
              </div>
              <BottomSheetFooter>
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
              </BottomSheetFooter>
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
// LongContent
// ---------------------------------------------------------------------------

export const LongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Long Content</Button>
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          snapPoint="half"
        >
          <BottomSheetHeader>
            <BottomSheetTitle>Scrollable Content</BottomSheetTitle>
            <BottomSheetDescription>
              The content below scrolls while the handle remains draggable.
            </BottomSheetDescription>
          </BottomSheetHeader>
          <div className="flex flex-col gap-3 py-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={`item-${i + 1}`}
                className="rounded-lg border border-border p-4"
              >
                <Text
                  as="p"
                  typography="text-sm-regular"
                  color="foreground"
                >
                  Item {i + 1} — Scroll through this content. Drag the handle to dismiss.
                </Text>
              </div>
            ))}
          </div>
          <BottomSheetFooter>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
      </>
    );
  },
};
