Rails.application.routes.draw do
  namespace :api, :defaults => { :format => :json }  do
    namespace :v1 do
      # resources :challenges
      resources :games, :only => [:index, :show, :create]
      resources :tournaments, :only => [:index, :show]
      resources :players, :only => [:index, :show, :create] do
        get :stats
      end
    end
  end
end
