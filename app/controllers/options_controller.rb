class OptionsController < ApplicationController
	def show
		@option = Option.find(params[:id])
	end

	def edit
		@option = Option.find(params[:id])
	end

	def create
		@category = Category.find(params[:category_id])
		@option = @category.options.create(option_params)
		#*** Handle when @option.save fails
		redirect_to matrix_category_path({id: params[:category_id]})
	end

	def update
		@option = Option.find(params[:id])
		if @option.update(option_params)
			render 'show'
		else
			render 'edit'
		end
	end

	def destroy
		@option = Option.find(params[:id])
		@option.destroy
		redirect_to matrix_category_path(@option.category.matrix, @option.category)
	end

	private
		def option_params
			params.require(:option).permit(:name)
		end
end
