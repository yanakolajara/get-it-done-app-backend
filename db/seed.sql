\c get_it_done_app;

-- Users
INSERT INTO
    users(first_name, middle_name, last_name, email,country_code,phone,auth)
VALUES
    ('Ynk', null, 'laj','ynk@test.com', 52, '1234567890', 'fgf98vYNY78OGFGT4%^UYT4TRTRG'),
    ('Luz', 'ele', 'piz','LUZ@test.com', 431, '9876543210', 'GFGT4%^UYT4TRTRGf98vYNY78Ogf');

-- Parent tasks
INSERT INTO
    tasks(user_id, content, completed, date, previews_task_id, next_task_id)
VALUES
    (1, 'Clean my desk', false, '2024-04-06', 2, null),
    (1, 'Organize closet', false, '2024-04-06', null, 1),
    (2, 'Study for exam', false, '2024-03-10', 4, null),
    (2, 'Exercise routine', false, '2024-03-12', null, 3);

-- Child tasks
INSERT INTO
    steps(task_id, content, completed, physical_energy, emotional_energy , previews_step_id, next_step_id)
VALUES
    -- Child tasks for Ynk's tasks
    (1, 'Take the items out', false, 3, 2, null, 2),
    (1, 'Clean the surface', false, 2, 1, 1, 3),
    (1, 'Polish the wood', false, 3, 4, 2, 4),
    (1, 'Put things back', false, 1, 2, 3, null),
    (2, 'Take clothes out', false, 2, 2, null, 6),
    (2, 'Sort clothes by type', false, 3, 3, 5, 7),
    (2, 'Fold clothes neatly', false, 2, 3, 6, 8),
    (2, 'Arrange clothes in closet', false, 2, null, 7, 9),
    -- Child tasks for Luz's tasks
    (3, 'Read Chapter 1', false, 2, 3,1, null),
    (3, 'Complete Practice Problems', false, 3, 4, 2, 0),
    (3, 'Review Lecture Notes', false, 2, 2, 3, 1),
    (3, 'Take Quiz', false, 2, 2, 4, 2),
    (4, 'Warm-up: Jogging', false, 3, 3, 1, null),
    (4, 'Strength Training', false, 3, 4, 2, 0),
    (4, 'Cardio: Running', false, 3, 3, 3, 1),
    (4, 'Cool Down: Stretching', false, 2, 2, 4, 2);

