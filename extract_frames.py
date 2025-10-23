import cv2
import os

# Paths
videos_dir = r'C:\Users\Harsha\OneDrive\Desktop\5MDS B\Project\Stagenix\Videos'
frames_base_dir = r'C:\Users\Harsha\OneDrive\Desktop\5MDS B\Project\Stagenix\frames'

# Create the base frames folder if it doesn't exist
os.makedirs(frames_base_dir, exist_ok=True)

# Loop through all files in the videos folder
for filename in os.listdir(videos_dir):
    if filename.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')):  # Only video files
        video_path = os.path.join(videos_dir, filename)
        video_name = os.path.splitext(filename)[0]

        # Create a folder for this video's frames
        output_dir = os.path.join(frames_base_dir, video_name)
        os.makedirs(output_dir, exist_ok=True)

        # Open the video
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        saved_count = 0  # Count how many frames were actually saved

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Save only every 10th frame
            if frame_count % 10 == 0:
                frame_filename = os.path.join(output_dir, f'frame_{saved_count:04d}.png')
                cv2.imwrite(frame_filename, frame)
                saved_count += 1

            frame_count += 1

        cap.release()
        print(f"Extracted {saved_count} frames (every 10th frame) from '{filename}' to '{output_dir}'")
