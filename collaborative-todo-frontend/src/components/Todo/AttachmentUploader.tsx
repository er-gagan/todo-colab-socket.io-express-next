// app/todo/components/AttachmentUploader.tsx
import { Button } from '@nextui-org/react';

export const AttachmentUploader = () => {
    return (
        <div className="mt-4">
            <h4>Attachments</h4>
            <input type="file" multiple className="my-2" />
            <Button className='m-auto' color="secondary">Upload Files</Button>
        </div>
    );
};
