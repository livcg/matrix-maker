class Matrix < ActiveRecord::Base
	has_many :categories, dependent: :destroy

	validates :name, presence: true,
					 length: { minimum: 1 }
end
