class CategoriesController < ApplicationController

	def show
		//*** Mv below to private method
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.find(params[:id])
	end

	def edit
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.find(params[:id])
	end

	def create
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.create(category_params)
		#*** Handle when @category.save fails, e.g. blank name
		redirect_to matrix_path(@matrix)
	end

	def update
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.find(params[:id])
		if @category.update(category_params)
			render 'show'
		else
			render 'edit'
		end
	end

	def destroy
		@matrix = Matrix.find(params[:matrix_id])
		@category = @matrix.categories.find(params[:id])
		@category.destroy
		redirect_to matrix_path(@matrix)
	end

	private
		def category_params
			params.require(:category).permit(:name, :option)
		end
end
