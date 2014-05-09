Rails.application.routes.draw do
  namespace :api, :defaults => { :format => :json }  do
    namespace :v1 do
      resources :players
      resources :tournaments
    end
  end
end
