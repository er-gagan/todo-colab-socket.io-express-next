// app/todo/components/TaskComments.tsx
import { Card, Textarea, Button, Avatar } from '@nextui-org/react';

export const TaskComments = () => {
    return (
        <Card className="p-4 mt-4">
            <h4>Comments</h4>
            <div className="space-y-4">
                {/* Display comments */}
                <div className="flex space-x-3 items-center">
                    <Avatar name='JD' />
                    <div>
                        <b>John Doe</b>
                        <small className="text-gray-500">2 hours ago</small>
                        <div>Great work on this task so far. Let's finalize it by tomorrow.</div>
                    </div>
                </div>
                {/* New comment input */}
                <Textarea fullWidth placeholder="Add a comment..." />
                <Button className='m-auto' color="primary">Post Comment</Button>
            </div>
        </Card>
    );
};
