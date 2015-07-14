class Category < ActiveRecord::Base
  belongs_to :matrix
  has_many :options

	validates :name, presence: true,
					 length: { minimum: 1 }
end
