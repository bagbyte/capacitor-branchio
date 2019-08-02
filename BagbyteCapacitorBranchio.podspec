
  Pod::Spec.new do |s|
    s.name = 'BagbyteCapacitorBranchio'
    s.version = '0.0.2'
    s.summary = 'Capacitor plugin for web, iOS and Android for using native Branch.io SDK'
    s.license = 'MIT'
    s.homepage = 'https://github.com/bagbyte/capacitor-branchio.git'
    s.authors = { "Sabino Papagna" => 'sabino84@gmail.com' }
    s.source = { :git => 'https://github.com/bagbyte/capacitor-branchio.git', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
    s.dependency 'Branch'
  end
