class CategoriesController < ApplicationController

	def show
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
		if @category.save
			redirect_to matrix_path(@matrix)
		else
			render 'new' #*** ?
		end
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
