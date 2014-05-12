class ReportGame < Mutations::Command
  required do
    array :players
  end

  def execute
    NewGame.run!(:players => players).tap do |game|
    end
  end
end