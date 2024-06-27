document.addEventListener('DOMContentLoaded', () => {
    fetch('/getRecipes')
        .then(response => response.json())
        .then(recipes => {
            const recipeContainer = document.getElementById('recipeContainer');
            recipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card';

                const recipeImage = document.createElement('img');
                recipeImage.src = recipe.image ? recipe.image : 'assets/default_recipe_image.png';
                recipeImage.alt = recipe.name;

                const recipeName = document.createElement('div');
                recipeName.className = 'recipe-name';
                recipeName.textContent = recipe.name;

                const recipeIngredients = document.createElement('div');
                recipeIngredients.className = 'recipe-ingredients';
                recipeIngredients.textContent = `Ingredients: ${recipe.ingredients}`;

                const recipeInstructions = document.createElement('div');
                recipeInstructions.className = 'recipe-instructions';
                recipeInstructions.textContent = `Instructions: ${recipe.instructions}`;

                recipeCard.appendChild(recipeImage);
                recipeCard.appendChild(recipeName);
                recipeCard.appendChild(recipeIngredients);
                recipeCard.appendChild(recipeInstructions);
                recipeContainer.appendChild(recipeCard);
            });
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
});
