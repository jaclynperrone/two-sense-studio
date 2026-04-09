class Shared::Navbar < Bridgetown::Component
  def initialize(metadata:, resource:)
    @metadata, @resource = metadata, resource
  end
  def active_class?(path)
    # Use @resource.relative_url to match Bridgetown's modern logic
    "active" if @resource.relative_url == relative_url(path)
  end
end
