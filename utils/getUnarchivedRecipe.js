module.exports = function(recipeList){
    return recipeList.filter(function(recipe){
        return recipe.archive == false
    })
}