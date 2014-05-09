Rails.application.routes.draw do
  namespace :api, :defaults => { :format => :json }  do
    namespace :v1 do
      resources :players
      resources :tournaments
    end
  end

  root :to => "pages#index"
  match "*path", :to => "pages#index", :via => "get"
end
