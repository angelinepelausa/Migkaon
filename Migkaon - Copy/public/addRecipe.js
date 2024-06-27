document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipeForm');
    const addPhotoLink = document.getElementById('addPhotoLink');
    const addPhotoImg = document.querySelector('.add-photo');
    let selectedImageFile;

    addPhotoLink.addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedImageFile = file;
                console.log('Selected file:', file.name);

                // Change the color of the add_photo image
                addPhotoImg.classList.add('photo-selected');
            }
        };
        
        input.click();
    });

    recipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const recipeName = document.getElementById('recipeName').value;
        const ingredients = document.getElementById('ingredients').value;
        const instructions = document.getElementById('instructions').value;

        try {
            const formData = new FormData();
            formData.append('recipeName', recipeName);
            formData.append('ingredients', ingredients);
            formData.append('instructions', instructions);
            // Append image file if selected
            if (selectedImageFile) {
                formData.append('image', selectedImageFile);
            }

            const response = await fetch('/addRecipe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add recipe');
            }

            alert('Recipe added successfully!');
            recipeForm.reset(); // Optionally clear the form fields
            selectedImageFile = null; // Clear the selected image

            // Remove the photo-selected class to reset the image color
            addPhotoImg.classList.remove('photo-selected');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add recipe. Please try again.');
        }
    });
});
